import hashlib,json,tempfile,unittest
from unittest.mock import patch
from pathlib import Path
from PIL import Image
from server import Project,create_app

class ProjectTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        images=self.root/'images';images.mkdir();seed=self.root/'seed';seed.mkdir()
        manifest=[]
        for i in range(14):
            name=f'SITE__2026__{i:04}__scan.png'
            Image.new('RGB',(100,100),(i,0,0)).save(images/name)
            if i<2:
                split='train' if i==0 else 'val'
                (seed/'labels'/split).mkdir(parents=True,exist_ok=True)
                (seed/'labels'/split/(Path(name).stem+'.txt')).write_text('0 .5 .5 .2 .2\n')
                manifest.append(dict(image=name,split=split,sha256=hashlib.sha256((images/name).read_bytes()).hexdigest()))
        (seed/'manifest.json').write_text(json.dumps(manifest))
        self.config=dict(name='test',images=str(images),storage=str(self.root/'state'),seed_dataset=str(seed),checkpoint='unused.pt',classes=['tyre'],threshold=10)
        self.p=Project(self.config,launch=False)
    def tearDown(self):self.tmp.cleanup()
    def review(self,i,boxes=None):
        name=f'SITE__2026__{i:04}__scan.png';digest=hashlib.sha256(self.p.files[name].read_bytes()).hexdigest()
        self.p.review(name,boxes if boxes is not None else [dict(label='tyre',x=1,y=1,width=10,height=10)],digest)
    def test_threshold_distinct_reviews_and_snapshot(self):
        for i in range(2,11):self.review(i)
        self.assertEqual(len(self.p.state['runs']),0)
        self.review(2);self.assertEqual(len(self.p.pending()),9)
        self.review(11);self.assertEqual(len(self.p.state['runs']),1)
        run=self.p.state['runs'][0];snapshot=json.loads((self.p.root/'runs'/run['id']/'snapshot.json').read_text())
        self.review(12)
        self.assertEqual(len(self.p.state['runs']),1)
        self.assertNotIn('SITE__2026__0012__scan.png',snapshot['reviews'])
    def test_frozen_validation_and_bad_content(self):
        with self.assertRaises(ValueError):self.review(1)
        with self.assertRaises(ValueError):self.p.review('SITE__2026__0002__scan.png',[],'wrong')
    def test_empty_review_persists_and_restart_marks_interrupted(self):
        self.review(2,[]);self.assertEqual(len(self.p.pending()),1)
        self.p.start(force=True)
        p=Project(self.config,launch=False)
        self.assertEqual(p.state['runs'][0]['status'],'failed')
        self.assertEqual(len(p.pending()),1)
    def test_completion_consumes_snapshot_only_and_keeps_new_review_pending(self):
        self.review(2);self.p.start(force=True)
        run=self.p.state['runs'][0];folder=self.p.root/'runs'/run['id']
        snapshot=json.loads((folder/'snapshot.json').read_text())
        self.review(3)
        (folder/'result.json').write_text(json.dumps({'metrics':{},'predicted_images':14}))
        with patch('server.subprocess.run'):
            self.p.execute(folder,snapshot)
        self.assertEqual(self.p.state['latest'],run['id'])
        self.assertEqual(self.p.pending(),['SITE__2026__0003__scan.png'])
    def test_failure_keeps_pending_reviews_and_does_not_promote(self):
        self.review(2);self.p.start(force=True)
        run=self.p.state['runs'][0];folder=self.p.root/'runs'/run['id']
        snapshot=json.loads((folder/'snapshot.json').read_text())
        with patch('server.subprocess.run',side_effect=RuntimeError('GPU failed')):
            self.p.execute(folder,snapshot)
        self.assertIsNone(self.p.state['latest'])
        self.assertEqual(len(self.p.pending()),1)
        self.assertEqual(run['status'],'failed')
    def test_infer_validates_names(self):
        from server import MAX_INFER_NAMES
        client = create_app(self.p).test_client()
        headers = {'X-MakeSense-Local': '1'}
        known = 'SITE__2026__0002__scan.png'
        self.assertEqual(client.post('/infer', json={'names': ['missing.png']}, headers=headers).status_code, 400)
        self.assertEqual(client.post('/infer', json={'names': []}, headers=headers).status_code, 400)
        self.assertEqual(client.post('/infer', json={'names': [known] * (MAX_INFER_NAMES + 1)}, headers=headers).status_code, 400)
        self.assertEqual(client.post('/infer', json={'names': [known]}).status_code, 403)

    def test_infer_busy_while_training_runs(self):
        self.review(2)
        self.p.start(force=True)
        client = create_app(self.p).test_client()
        response = client.post('/infer', json={'names': ['SITE__2026__0002__scan.png']}, headers={'X-MakeSense-Local': '1'})
        self.assertEqual(response.status_code, 409)

    def test_reviews_serves_saved_ground_truth(self):
        self.review(2)
        client = create_app(self.p).test_client()
        self.assertEqual(client.post('/reviews', json={}).status_code, 403)
        response = client.get('/reviews', headers={'X-MakeSense-Local': '1'})
        self.assertEqual(response.status_code, 200)
        entry = response.get_json()['SITE__2026__0002__scan.png']
        self.assertEqual(len(entry['boxes']), 1)
        self.assertIn('sha256', entry)

    def test_infer_predicts_known_images_with_cached_model(self):
        import hashlib
        from unittest.mock import patch
        class T:
            def __init__(self, v): self.v = v
            def cpu(self): return self
            def tolist(self): return self.v
        class Boxes:
            xyxy = T([[1, 2, 11, 12]]); cls = T([0]); conf = T([0.9])
        class Result: boxes = Boxes()
        class Model:
            names = {0: 'tyre'}
            calls = 0
            def predict(self, *args, **kwargs): return [Result()]
        created = []
        def factory(path):
            created.append(path); return Model()
        client = create_app(self.p).test_client()
        headers = {'X-MakeSense-Local': '1'}
        name = 'SITE__2026__0002__scan.png'
        with patch('ultralytics.YOLO', side_effect=factory):
            first = client.post('/infer', json={'names': [name]}, headers=headers)
            second = client.post('/infer', json={'names': [name]}, headers=headers)
        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(created, ['unused.pt'])
        entry = first.get_json()[name]
        self.assertEqual(entry['boxes'][0]['label'], 'tyre')
        self.assertEqual(entry['sha256'], hashlib.sha256(self.p.files[name].read_bytes()).hexdigest())

    def test_api_rejects_foreign_origin_and_unknown_run(self):
        client=create_app(self.p).test_client()
        self.assertEqual(client.get('/status',headers={'Origin':'https://evil.example'}).status_code,403)
        self.assertEqual(client.post('/train',json={}).status_code,403)
        self.assertEqual(client.get('/status').status_code,200)
        self.assertEqual(client.post('/predictions/missing',json={'names':[]},headers={'X-MakeSense-Local':'1'}).status_code,404)

if __name__=='__main__':unittest.main()
