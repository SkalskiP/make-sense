"""One immutable training/prediction run, isolated from the web service."""
import json,sys,hashlib
from pathlib import Path
from PIL import Image
from ultralytics import YOLO

folder=Path(sys.argv[1]).resolve();s=json.loads((folder/'snapshot.json').read_text());c=s['config']
import fcntl
training_lock=(Path(c['storage'])/'training.lock').open('w')
fcntl.flock(training_lock,fcntl.LOCK_EX | fcntl.LOCK_NB)
classes=c['classes']
for name,r in s['reviews'].items():
    image=Path(s['files'][name]);split=r['split']
    if hashlib.sha256(image.read_bytes()).hexdigest()!=r['sha256']:raise ValueError(f'Changed source image: {name}')
    for kind in ['images','labels']:(folder/'dataset'/kind/split).mkdir(parents=True,exist_ok=True)
    (folder/'dataset/images'/split/name).symlink_to(image)
    with Image.open(image) as im:w,h=im.size
    lines=[]
    for b in r['boxes']:
        x,y,bw,bh=(b[k] for k in ['x','y','width','height']);bw=min(bw,w-x);bh=min(bh,h-y)
        lines.append(f'{classes.index(b["label"])} {(x+bw/2)/w} {(y+bh/2)/h} {bw/w} {bh/h}')
    (folder/'dataset/labels'/split/(image.stem+'.txt')).write_text('\n'.join(lines))
import yaml
(folder/'data.yaml').write_text(yaml.safe_dump(dict(path=str(folder/'dataset'),train='images/train',val='images/val',names=classes)))
model=YOLO(s['checkpoint'])
if [model.names[i] for i in range(len(model.names))]!=classes:raise ValueError('Checkpoint class order differs from project')
model.train(data=str(folder/'data.yaml'),project=str(folder),name='train',exist_ok=False,
            epochs=c.get('epochs',10),imgsz=c.get('imgsz',1024),batch=c.get('batch',4),device=c.get('device',0),
            workers=2,seed=42,cache=False,plots=True,mosaic=0,mixup=0,fliplr=0,flipud=0,
            hsv_h=0,hsv_s=0,hsv_v=.1,translate=.05,scale=.1)
model=YOLO(str(folder/'train/weights/best.pt'))
metrics=model.val(data=str(folder/'data.yaml'),imgsz=c.get('imgsz',1024),device=c.get('device',0),plots=False)
predictions={}
# Predict all project images so historical comparisons also work after an image is reviewed.
# The UI only applies predictions to untouched, unreviewed images.
for index,(name,path) in enumerate(s['files'].items(),1):
    if index % 250 == 0: print(f'Predicting {index}/{len(s["files"])}',flush=True)
    result=model.predict(path,imgsz=c.get('imgsz',1024),conf=c.get('confidence',.25),device=c.get('device',0),verbose=False)[0]
    boxes=[]
    for coords,cls,conf in zip(result.boxes.xyxy.cpu().tolist(),result.boxes.cls.cpu().tolist(),result.boxes.conf.cpu().tolist()):
        x,y,X,Y=coords;boxes.append(dict(label=classes[int(cls)],x=x,y=y,width=X-x,height=Y-y,confidence=conf))
    predictions[name]=dict(boxes=boxes,sha256=hashlib.sha256(Path(path).read_bytes()).hexdigest())
(folder/'predictions.json').write_text(json.dumps(predictions))
(folder/'result.json').write_text(json.dumps(dict(metrics={k:float(v) for k,v in metrics.results_dict.items()},predicted_images=len(predictions))))
