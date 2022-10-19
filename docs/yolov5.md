## Convert

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
python export.py --weights yolov5s.pt --include tfjs
```
