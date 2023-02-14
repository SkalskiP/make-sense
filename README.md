[![Github Stars](https://img.shields.io/badge/stars-nominate-brightgreen?logo=github)](https://stars.github.com/nominate/)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/SkalskiP/make-sense?include_prereleases)
[![codecov](https://codecov.io/gh/SkalskiP/make-sense/branch/develop/graph/badge.svg?token=lWsADbAey2)](https://codecov.io/gh/SkalskiP/make-sense)
[![Gitter](https://badges.aleen42.com/src/gitter.svg)](https://gitter.im/make-sense-ai/community)
[![Discord](https://badges.aleen42.com/src/discord.svg)](https://discord.gg/ASCjCrNdA7)

<h1 align="center">makesense.ai</h1>

<p align="center">
    </br>
    <img width="100" src=".//public/favicon.png" alt="make sense logo">
    </br>
</p>

[makesense.ai][1] is a free-to-use online tool for labeling photos. Thanks to the use of a browser it does not require any complicated installation - just visit the website and you are ready to go. It also doesn't matter which operating system you're running on - we do our best to be truly cross-platform. It is perfect for small computer vision deep learning projects, making the process of preparing a dataset much easier and faster. Prepared labels can be downloaded in one of the multiple supported formats. The application was written in TypeScript and is based on React/Redux duo.

## 📄 Documentation

You can find out more about our tool from the newly released [documentation][14] - still under 🚧 construction. Let us know what topics we should cover first.

## 🤖 Advanced AI integrations

[makesense.ai][1] strives to significantly reduce the time you have to spend on photo labeling. We are doing our best to integrate the latest and greatest AI models, that can give you recommendations as well as automate repetitive and tedious activities.

* [YOLOv5][16] is our most powerful integration yet. Thanks to the use of [yolov5js][17] you can load not only pretrained models from [yolov5js-zoo](18), but above all your own models trained thanks to YOLOv5 and [exported](19) to tfjs format.
* [SSD][8] pretrained on the [COCO dataset][9], which will do some of the work for you in drawing bounding boxes on photos and also (in some cases) suggest a label. 
* [PoseNet][11] is a vision model that can be used to estimate the pose of a person in an image or video by estimating where key body joints are.

The engine that drives our AI functionalities is [TensorFlow.js][10] - JS version of the most popular framework for training neural networks. This choice allows us not only to speed up your work but also to care about the privacy of your data, because unlike with other commercial and open-source tools, your photos do not have to be transferred to the server. This time AI comes to your device!

https://user-images.githubusercontent.com/26109316/193255987-2d01c549-48c3-41ae-87e9-e1b378968966.mov

## 💻 Local Setup

```bash
# clone repository
git clone https://github.com/SkalskiP/make-sense.git

# navigate to main dir
cd make-sense

# install dependencies
npm install

# serve with hot reload at localhost:3000
npm start
```
To ensure proper functionality of the application locally, npm `8.x.x` and node.js `v16.x.x` versions are required. More information about this problem is available in the [#16][4].

## 🐳 Docker Setup

```bash
# Build Docker Image
docker build -t make-sense -f docker/Dockerfile .

# Run Docker Image as Service
docker run -dit -p 3000:3000 --restart=always --name=make-sense make-sense

# Get Docker Container Logs
docker logs make-sense

# Access make-sense: http://localhost:3000/
```

## ⌨️ Keyboard Shortcuts

| Functionality                      | Context  | Mac | Windows / Linux  |
|:-----------------------------------|:--------:|:---:|:----------------:|
| Polygon autocomplete               | Editor   | <kbd>Enter</kbd> | <kbd>Enter</kbd> |
| Cancel polygon drawing             | Editor   | <kbd>Escape</kbd> | <kbd>Escape</kbd> |
| Delete currently selected label    | Editor   | <kbd>Backspace</kbd> | <kbd>Delete</kbd> |
| Load previous image                | Editor   | <kbd>⌥</kbd> + <kbd>Left</kbd> | <kbd>Ctrl</kbd> + <kbd>Left</kbd> |
| Load next image                    | Editor   | <kbd>⌥</kbd> + <kbd>Right</kbd> | <kbd>Ctrl</kbd> + <kbd>Right</kbd> |
| Zoom in                            | Editor   | <kbd>⌥</kbd> + <kbd>+</kbd> | <kbd>Ctrl</kbd> + <kbd>+</kbd> |
| Zoom out                           | Editor   | <kbd>⌥</kbd> + <kbd>-</kbd> | <kbd>Ctrl</kbd> + <kbd>-</kbd> |
| Move image                         | Editor   | <kbd>Up</kbd> / <kbd>Down</kbd> / <kbd>Left</kbd> / <kbd>Right</kbd> | <kbd>Up</kbd> / <kbd>Down</kbd> / <kbd>Left</kbd> / <kbd>Right</kbd> |
| Select Label                       | Editor   | <kbd>⌥</kbd> + <kbd>0-9</kbd> | <kbd>Ctrl</kbd> + <kbd>0-9</kbd> |
| Exit popup                         | Popup    | <kbd>Escape</kbd> | <kbd>Escape</kbd> |

**Table 1.** Supported keyboard shortcuts

## ⬆️ Export Formats

|               | CSV | YOLO | VOC XML | VGG JSON | COCO JSON | PIXEL MASK |
|:-------------:|:---:|:----:|:-------:|:--------:|:---------:|:----------:|
| **Point**     | ✓   | ✗    | ☐       | ☐        | ☐         | ✗          |
| **Line**      | ✓   | ✗    | ✗       | ✗        | ✗         | ✗          |
| **Rect**      | ✓   | ✓    | ✓       | ☐        | ☐         | ✗          |
| **Polygon**   | ☐   | ✗    | ☐       | ✓        | ✓         | ☐          |
| **Label**     | ✓   | ✗    | ✗       | ✗        | ✗         | ✗          |

**Table 2.** The matrix of supported labels export formats, where:
* ✓ - supported format
* ☐ - not yet supported format
* ✗ - format does not make sense for a given label type  

You can find examples of export files along with a description and schema on our [Wiki][7].

## ⬇️ Import Formats

|               | CSV | YOLO | VOC XML | VGG JSON | COCO JSON | PIXEL MASK |
|:-------------:|:---:|:----:|:-------:|:--------:|:---------:|:----------:|
| **Point**     | ☐   | ✗    | ☐       | ☐        | ☐         | ✗          |
| **Line**      | ☐   | ✗    | ✗       | ✗        | ✗         | ✗          |
| **Rect**      | ☐   | ✓    | ✓       | ☐        | ✓         | ✗          |
| **Polygon**   | ☐   | ✗    | ☐       | ☐        | ✓         | ☐          |
| **Label**     | ☐   | ✗    | ✗       | ✗        | ✗         | ✗          |

**Table 3.** The matrix of supported labels import formats
* ✓ - supported format
* ☐ - not yet supported format
* ✗ - format does not make sense for a given label type  

## 🔐 Privacy

We don't store your images, because we don't send them anywhere in the first place.

## 🚀 Tutorials

If you are just starting your adventure with deep learning and would like to learn and create something cool along the way, [makesense.ai][1] can help you with that. Leverage our bounding box labeling functionality to prepare a data set and use it to train your first state-of-the-art object detection model. Follow [instructions][12] and [examples][13] but most importantly, free your creativity.


## 🏆 Contribution

<p align="center"> 
    <a href="https://github.com/SkalskiP/make-sense/graphs/contributors">
      <img src="https://contrib.rocks/image?repo=SkalskiP/make-sense" />
    </a>
</p>

## 💬 Citation

Please cite Make Sense in your publications if this is useful for your research. Here is an example BibTeX entry:

```BibTeX
@MISC{make-sense,
   author = {Piotr Skalski},
   title = {{Make Sense}},
   howpublished = "\url{https://github.com/SkalskiP/make-sense/}",
   year = {2019},
}
```

## 🪧 License

This project is licensed under the GPL-3.0 License - see the [LICENSE][2] file for details. Copyright &copy; 2019 Piotr Skalski.

[1]: http://makesense.ai
[2]: ./LICENSE
[3]: https://twitter.com/PiotrSkalski92
[4]: https://github.com/SkalskiP/make-sense/issues/16
[5]: https://gitter.im/make-sense-ai/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link
[6]: https://github.com/SkalskiP/make-sense/wiki/Road-Map
[7]: https://github.com/SkalskiP/make-sense/wiki/Supported-Output-Formats
[8]: https://arxiv.org/abs/1512.02325
[9]: http://cocodataset.org
[10]: https://www.tensorflow.org/js
[11]: https://www.tensorflow.org/lite/models/pose_estimation/overview
[12]: https://towardsdatascience.com/chess-rolls-or-basketball-lets-create-a-custom-object-detection-model-ef53028eac7d
[13]: https://github.com/SkalskiP/ILearnDeepLearning.py/tree/master/02_data_science_toolkit/02_yolo_object_detection
[14]: https://skalskip.github.io/make-sense/
[15]: https://github.com/SkalskiP/make-sense/issues
[16]: https://github.com/ultralytics/yolov5
[17]: https://github.com/SkalskiP/yolov5js 
[18]: https://github.com/SkalskiP/yolov5js-zoo
[19]: https://github.com/ultralytics/yolov5/blob/master/export.py
