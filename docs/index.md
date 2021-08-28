<h1 align="center">makesense.ai</h1>

<p align="center"> 
    <img width="120" src="https://user-images.githubusercontent.com/26109316/131229187-1d93dc42-963c-440e-8f38-53ee72a2260d.png" alt="make-sense">
</p>


[makesense.ai][1] is a free to use online tool for labelling photos. Thanks to the use of a browser it does not require any complicated installation - just visit the website and you are ready to go. It also doesn't matter which operating system you're running on - we do our best to be truly cross-platform. It is perfect for small computer vision deeplearning projects, making the process of preparing a dataset much easier and faster. Prepared labels can be downloaded  in one of multiple supported formats. The application was written in TypeScript and is based on React/Redux duo.

## Advanced AI functionalities

[makesense.ai][1] strives to significantly reduce the time we have to spend on labeling photos. To achieve this, we are going to use many different AI models that will be able to give you recommendations as well as automate repetitive and tedious activities.

* [SSD model][8] pretrained on the [COCO dataset][9], which will do some of the work for you in drawing bboxes on photos and  also (in some cases) suggest a label.
* [PoseNet model][11] is a vision model that can be used to estimate the pose of a person in an image or video by estimating where key body joints are.

In the future, we also plan to add, among other things, models that classify photos, detect characteristic features of faces as well as whole faces. The engine that drives our AI functionalities is [TensorFlow.js][10] - JS version of the most popular framework for training neural networks. This choice allows us not only to speed up your work but also to care about the privacy of your data, because unlike with other commercial and open source tools, your photos do not have to be transferred to the server. This time AI comes to your device!


[1]: http://makesense.ai
[8]: https://arxiv.org/abs/1512.02325
[9]: http://cocodataset.org
[10]: https://www.tensorflow.org/js
[11]: https://www.tensorflow.org/lite/models/pose_estimation/overview
