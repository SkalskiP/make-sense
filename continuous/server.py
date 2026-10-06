"""Local single-project continuous learning service. Run with --config PATH."""
import argparse, copy, hashlib, json, math, subprocess, sys, threading, uuid
from datetime import datetime, timezone
from pathlib import Path
from flask import Flask, request, jsonify, abort


MAX_INFER_NAMES = 100


class InferenceBusy(RuntimeError):
    pass


def atomic(path, data):
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(data, indent=2)); temp.replace(path)


class Project:
    def __init__(self, config, launch=True):
        self.config = config
        self.root = Path(config['storage']).resolve(); self.root.mkdir(parents=True, exist_ok=True)
        self.images = Path(config['images']).resolve()
        self.lock = threading.RLock(); self.launch = launch
        self.infer_lock = threading.Lock(); self.infer_model = None; self.infer_checkpoint = None
        self.files = {p.name: p for p in sorted(self.images.iterdir()) if p.suffix.lower() in {'.png', '.jpg', '.jpeg'}}
        self.state_path = self.root/'state.json'
        if self.state_path.exists():
            self.state = json.loads(self.state_path.read_text())
            if self.state['config'] != config:
                raise ValueError('Project configuration changed; use a new storage directory')
            for run in self.state['runs']:
                if run['status'] == 'running':
                    run.update(status='failed', error='Service interrupted; retry explicitly')
        else:
            self.state = dict(config=config, reviews={}, trained={}, runs=[], latest=None)
            seed = Path(config['seed_dataset'])
            for item in json.loads((seed/'manifest.json').read_text()):
                path = self.files[item['image']]
                from PIL import Image
                with Image.open(path) as im: w, h = im.size
                boxes = []
                for line in (seed/'labels'/item['split']/(path.stem+'.txt')).read_text().splitlines():
                    c, x, y, bw, bh = map(float, line.split())
                    boxes.append(dict(label=config['classes'][int(c)], x=(x-bw/2)*w, y=(y-bh/2)*h, width=bw*w, height=bh*h))
                self.state['reviews'][path.name] = dict(boxes=boxes, revision=1, split=item['split'], sha256=item['sha256'])
                self.state['trained'][path.name] = 1
        self.save()

    def save(self): atomic(self.state_path, self.state)

    def pending(self):
        return [n for n, r in self.state['reviews'].items()
                if r['split'] == 'train' and r['revision'] > self.state['trained'].get(n, 0)]

    def checkpoint(self):
        with self.lock:
            for run in reversed(self.state['runs']):
                if run['status'] == 'complete':
                    path = self.root/'runs'/run['id']/'train/weights/best.pt'
                    if path.exists(): return f'run:{run["id"]}', str(path)
            return 'seed', self.config['checkpoint']

    def infer(self, names):
        if not isinstance(names, list) or not names or len(names) > MAX_INFER_NAMES:
            raise ValueError(f'Provide 1-{MAX_INFER_NAMES} image names per inference request')
        with self.lock:
            unknown = [n for n in names if n not in self.files]
            if unknown: raise ValueError(f'Unknown images: {", ".join(unknown[:5])}')
            if any(r['status'] == 'running' for r in self.state['runs']):
                raise InferenceBusy('Training in progress; retry after it completes')
            classes = self.config['classes']
            confidence = self.config.get('confidence', 0.25)
            imgsz = self.config.get('imgsz', 1024)
            device = self.config.get('device', 0)
        if not self.infer_lock.acquire(blocking=False):
            raise InferenceBusy('Inference already running; retry shortly')
        try:
            with self.lock:
                if any(r['status'] == 'running' for r in self.state['runs']):
                    raise InferenceBusy('Training in progress; retry after it completes')
            label, checkpoint = self.checkpoint()
            from ultralytics import YOLO
            if self.infer_model is None or self.infer_checkpoint != checkpoint:
                model = YOLO(checkpoint)
                if [model.names[i] for i in range(len(model.names))] != classes:
                    raise ValueError('Checkpoint class order differs from project')
                self.infer_model = model; self.infer_checkpoint = checkpoint
            model = self.infer_model
            output = {}
            for name in names:
                path = self.files[name]
                digest = hashlib.sha256(path.read_bytes()).hexdigest()
                result = model.predict(str(path), imgsz=imgsz, conf=confidence, device=device, verbose=False)[0]
                boxes = []
                if result.boxes is not None:
                    for coords, cls, conf in zip(result.boxes.xyxy.cpu().tolist(),
                                                 result.boxes.cls.cpu().tolist(),
                                                 result.boxes.conf.cpu().tolist()):
                        x, y, X, Y = coords
                        boxes.append(dict(label=classes[int(cls)], x=x, y=y, width=X - x, height=Y - y, confidence=conf))
                output[name] = dict(boxes=boxes, sha256=digest, source=label)
            return output
        finally:
            self.infer_lock.release()

    def status(self):
        with self.lock:
            return dict(project=self.config['name'], classes=self.config['classes'],
                        pending=len(self.pending()), threshold=self.config.get('threshold', 10),
                        reviewed={n:r['split'] for n,r in self.state['reviews'].items()},
                        runs=self.state['runs'], latest=self.state['latest'])

    def review(self, name, boxes, digest):
        with self.lock:
            if name not in self.files: raise ValueError('Image is not in the configured project')
            if hashlib.sha256(self.files[name].read_bytes()).hexdigest() != digest:
                raise ValueError('Image content differs from the server project')
            previous = self.state['reviews'].get(name)
            group = '__'.join(name.split('__')[:3])
            reserved = {'__'.join(n.split('__')[:3]) for n,r in self.state['reviews'].items() if r['split']=='val'}
            if group in reserved: raise ValueError('This acquisition date is reserved for validation; training review is blocked')
            if any(r['split']=='val' and r['sha256']==digest for r in self.state['reviews'].values()):
                raise ValueError('Image duplicates validation data')
            if previous and previous['split'] == 'val': raise ValueError('Validation labels are frozen')
            from PIL import Image
            with Image.open(self.files[name]) as im: w,h=im.size
            for b in boxes:
                if b['label'] not in self.config['classes']: raise ValueError('Unknown class')
                vals=[b[k] for k in ['x','y','width','height']]
                if not all(isinstance(v,(int,float)) and math.isfinite(v) for v in vals): raise ValueError('Invalid coordinates')
                x,y,bw,bh=vals
                if min(x,y)<0 or min(bw,bh)<=0 or x+bw>w+1 or y+bh>h+1: raise ValueError('Box outside image')
            # Content-equivalent saves do not increment the review count.
            if previous and previous['boxes'] == boxes: return
            self.state['reviews'][name] = dict(boxes=boxes, revision=(previous or {}).get('revision',0)+1,
                                               split='train',sha256=digest)
            self.save()
            if len(self.pending()) >= self.config.get('threshold',10): self.start()

    def start(self, force=False):
        with self.lock:
            if any(r['status']=='running' for r in self.state['runs']): return False
            if not force and self.state['runs'] and self.state['runs'][-1]['status']=='failed': return False
            if not force and len(self.pending()) < self.config.get('threshold',10): return False
            ident=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')+'_'+uuid.uuid4().hex[:6]
            folder=self.root/'runs'/ident;folder.mkdir(parents=True)
            previous=self.state['latest']
            checkpoint=str(self.root/'runs'/previous/'train/weights/best.pt') if previous else self.config['checkpoint']
            snapshot=dict(config=self.config, reviews=copy.deepcopy(self.state['reviews']), checkpoint=checkpoint,
                          files={n:str(p) for n,p in self.files.items()},id=ident)
            atomic(folder/'snapshot.json',snapshot)
            self.state['runs'].append(dict(id=ident,status='running',created=datetime.now(timezone.utc).isoformat(),
                                          training_images=sum(r['split']=='train' for r in snapshot['reviews'].values())))
            self.save()
            if self.launch: threading.Thread(target=self.execute,args=(folder,snapshot),daemon=True).start()
            return True

    def execute(self, folder, snapshot):
        try:
            with (folder/'worker.log').open('w') as log:
                subprocess.run([sys.executable,str(Path(__file__).with_name('worker.py')),str(folder)],
                               stdout=log,stderr=subprocess.STDOUT,check=True)
            output=json.loads((folder/'result.json').read_text())
            with self.lock:
                run=next(r for r in self.state['runs'] if r['id']==folder.name)
                run.update(status='complete',**output)
                self.state['latest']=folder.name
                self.state['trained']={n:r['revision'] for n,r in snapshot['reviews'].items()}
                self.save();self.start()  # New reviews received while training form the next batch.
        except Exception as exc:
            with self.lock:
                next(r for r in self.state['runs'] if r['id']==folder.name).update(status='failed',error=str(exc))
                self.save()  # Preserve pending reviews; retry requires an explicit request.


def create_app(project):
    app=Flask(__name__)
    app.config['MAX_CONTENT_LENGTH']=20*1024*1024
    @app.before_request
    def local_only():
        if request.host.split(':')[0] not in {'localhost','127.0.0.1'}: abort(403)
        origin=request.headers.get('Origin')
        if origin:
            from urllib.parse import urlparse
            if urlparse(origin).hostname not in {'localhost','127.0.0.1'}: abort(403)
        if request.method=='POST' and request.headers.get('X-MakeSense-Local')!='1': abort(403)
    @app.after_request
    def cors(response):
        origin=request.headers.get('Origin')
        if origin and request.host.split(':')[0] in {'localhost','127.0.0.1'}:
            from urllib.parse import urlparse
            if urlparse(origin).hostname in {'localhost','127.0.0.1'}:
                response.headers['Access-Control-Allow-Origin']=origin
                response.headers['Access-Control-Allow-Headers']='Content-Type, X-MakeSense-Local'
                response.headers['Access-Control-Allow-Methods']='GET, POST, OPTIONS'
        return response
    @app.errorhandler(ValueError)
    def invalid(exc): return jsonify(error=str(exc)),400
    @app.get('/status')
    def status(): return jsonify(project.status())
    @app.post('/review')
    def review():
        data=request.get_json();project.review(data['name'],data['boxes'],data['sha256']);return jsonify(project.status())
    @app.post('/train')
    def train(): return jsonify(started=project.start(force=True))
    @app.post('/infer')
    def infer():
        try:
            data = request.get_json(force=True, silent=True) or {}
            return jsonify(project.infer(data.get('names')))
        except InferenceBusy as exc:
            return jsonify(error=str(exc)), 409
    @app.route('/reviews', methods=['GET', 'POST'])
    def reviews():
        with project.lock:
            return jsonify({name: dict(entry) for name, entry in project.state['reviews'].items()})
    @app.post('/predictions/<ident>')
    def predictions(ident):
        with project.lock:
            if not any(r['id']==ident and r['status']=='complete' for r in project.state['runs']): abort(404)
        data=json.loads((project.root/'runs'/ident/'predictions.json').read_text())
        return jsonify({n:data[n] for n in request.get_json()['names'] if n in data})
    return app

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--config',required=True);parser.add_argument('--port',type=int,default=8765)
    args=parser.parse_args();project=Project(json.loads(Path(args.config).read_text()))
    create_app(project).run(host='127.0.0.1',port=args.port,threaded=True,use_reloader=False)
