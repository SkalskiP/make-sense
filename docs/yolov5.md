## Convert PyTorch model

``` sh
# clone YOLOv5 repository
git clone https://github.com/ultralytics/yolov5.git
cd yolov5

# create python virtual environment [recommended]
virtualenv venv
source venv/bin/activate

# install dependencies
pip install -r requirements.txt
pip install tensorflowjs

# convert model to tensorflow.js format
python export.py --weights yolov5n.pt --include tfjs
```

This will create the following structure containing tensorflow.js model files:

```
.
├─ yolov5n_web_model/
│  ├─ group1-shard1of2.bin
│  ├─ group1-shard2of2.bin
│  └─ model.json
└─ export.py
```

## Create class names file

There is one more step we need to take before we upload our custom model to the editor - prepare :material-file-code: `labels.txt`. This file contains object class names separated by newline characters. Here's an [example](https://github.com/SkalskiP/make-sense/files/9824406/labels.txt) for COCO dataset.

## Upload tensorflow.js model

