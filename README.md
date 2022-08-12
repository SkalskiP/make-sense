[![Build Status](https://travis-ci.org/SkalskiP/make-sense.svg?branch=develop)](https://travis-ci.org/SkalskiP/make-sense)
[![codecov](https://codecov.io/gh/SkalskiP/make-sense/branch/develop/graph/badge.svg?token=lWsADbAey2)](https://codecov.io/gh/SkalskiP/make-sense)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/SkalskiP/make-sense?include_prereleases)
[![Gitter](https://badges.gitter.im/make-sense-ai/community.svg)](https://gitter.im/make-sense-ai/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<h1 align="center">makesense.ai</h1>

<p align="center">
    </br>
    <img width="100" src=".//public/favicon.png" alt="make sense logo">
    </br>
</p>

[makesense.ai][1] is a free-to-use online tool for labeling photos. Thanks to the use of a browser it does not require any complicated installation - just visit the website and you are ready to go. It also doesn't matter which operating system you're running on - we do our best to be truly cross-platform. It is perfect for small computer vision deep learning projects, making the process of preparing a dataset much easier and faster. Prepared labels can be downloaded  in one of the multiple supported formats. The application was written in TypeScript and is based on React/Redux duo.

## 📄 Documentation

You can find out more about our tool from the newly released [documentation][14].

## 👀 Sneak Peek

<div align="center">
<p>
   <img width="850" src=".//examples/demo-base.gif">
</p>
</div>

**Figure 1.** Basic version of the application - without AI support

## 🤖 Advanced AI functionalities

[makesense.ai][1] strives to significantly reduce the time we have to spend on labeling photos. To achieve this, we are going to use many different AI models that will be able to give you recommendations as well as automate repetitive and tedious activities.

* [SSD model][8] pretrained on the [COCO dataset][9], which will do some of the work for you in drawing bboxes on photos and  also (in some cases) suggest a label. 
* [PoseNet model][11] is a vision model that can be used to estimate the pose of a person in an image or video by estimating where key body joints are.

In the future, we also plan to add, among other things, models that classify photos, detect characteristic features of faces as well as whole faces. The engine that drives our AI functionalities is [TensorFlow.js][10] - JS version of the most popular framework for training neural networks. This choice allows us not only to speed up your work but also to care about the privacy of your data, because unlike with other commercial and open source tools, your photos do not have to be transferred to the server. This time AI comes to your device!

<div align="center">
<p>
   <img width="850" src=".//examples/demo-ssd.gif">
</p>
</div>

**Figure 2.** SSD model - allows you to detect multiple objects, speeding up the bbox labeling process

<div align="center">
<p>
   <img width="850" src=".//examples/demo-posenet.gif">
</p>
</div>

**Figure 3.** PoseNet model - allows you to detect people's poses in photos, automating point labeling in some usecases

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
To ensure proper functionality of the application locally, an npm `6.x.x` and node.js `v12.x.x` versions are required. More information about this problem is available in the [#16][4].

## 🐳 Docker Setup

```bash
# Build Docker Image
docker build -t make_sense docker/

# Run Docker Image as Service
docker run -dit -p 3000:3000 --restart=always --name=make_sense make_sense

# Get Docker Container IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' make_sense
# Go to `<DOCKER_CONTAINER_IP>:3000`

# Get Docker Container Logs
docker logs make_sense
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
| **Rect**      | ☐   | ✓    | ☐       | ☐        | ✓         | ✗          |
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

<div align="center">
<p>
   <img width="850" src=".//examples/object_detection_basketball.gif">
</p>
</div>

**Figure 4.** Detection of players moving around the basketball court, based on <a href="https://research.google.com/youtube8m/">YouTube-8M</a> dataset.

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
