[![Build Status](https://travis-ci.org/SkalskiP/make-sense.svg?branch=develop)](https://travis-ci.org/SkalskiP/make-sense)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/SkalskiP/make-sense?include_prereleases)
[![Gitter](https://badges.gitter.im/make-sense-ai/community.svg)](https://gitter.im/make-sense-ai/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

<h1 align="center">makesense.ai</h1>

<p align="center"> 
    <img width="600" src=".//public/img/main-image-dark_alter.png" alt="Logo">
</p>

## Description

[makesense.ai][1] is a free to use online tool for labelling photos. Thanks to the use of a browser it does not require any complicated installation - just visit the website and you are ready to go. It also doesn't matter which operating system you're running on - we do our best to be truly cross-platform. It is perfect for small computer vision deeplearning projects, making the process of preparing a dataset much easier and faster. Prepared labels can be downloaded  in one of multiple supported formats. The application was written in TypeScript and is based on React/Redux duo.

## Motto

> For AI to be free we need not just Open Source, but also a strong Open Data movement.  

Andrew Ng

## Sneak Peek

<p align="center"> 
    <img width="1000" src=".//examples/alfa-demo.gif" alt="bbox">
</p>

## Set Up the Project Locally

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
To ensure proper functionality of the application locally, an npm `6.x.x` and node.js `v11.x.x` versions are required. More information about this problem is available in the [#16][4].

## Supported Keyboard Shortcuts

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
| Exit popup                         | Popup    | <kbd>Escape</kbd> | <kbd>Escape</kbd> |

**Table 1.** Supported keyboard shortcuts

## Supported Output Formats

|               | CSV | YOLO | VOC XML | VGG JSON | COCO | PIXEL MASK |
|:-------------:|:---:|:----:|:-------:|:--------:|:----:|:----------:|
| **Point**     | ☑   | ☒    | ☐       | ☐        | ☐    | ☒          |
| **Rect**      | ☑   | ☑    | ☑       | ☐        | ☐    | ☒          |
| **Polygon**   | ☐   | ☒    | ☐       | ☑        | ☐    | ☐          |

**Table 2.** The matrix of supported labels export format, where:
* ☑ - supported format
* ☐ - not yet supported format
* ☒ - format does not make sense for a given label type  

You can find examples of export files along with a description and schema on our [Wiki][7].

## Privacy

We don't store your images, because we don't send them anywhere in the first place.

## Road Map

Our application is being actively developed. Check out our plans for the near future on our [Wiki][6]. If you have an idea for a new functionality, please hit us on [Twitter][3] and [Gitter][5] or create an issue where you can describe your concept. In the meantime, see what improvements we are planning for you in the future.

## Contribution

Feel free to file [issues](https://github.com/SkalskiP/make-sense/issues) or [pull requests](https://github.com/SkalskiP/make-sense/pulls).  

## Citation

```
@MISC{make-sense,
   author = {Piotr Skalski},
   title = {{Make Sense}},
   howpublished = "\url{https://github.com/SkalskiP/make-sense/}",
   year = {2019},
}
```

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE][2] file for details

Copyright (c) 2019-present, Piotr Skalski

[1]: http://makesense.ai
[2]: ./LICENSE
[3]: https://twitter.com/PiotrSkalski92
[4]: https://github.com/SkalskiP/make-sense/issues/16
[5]: https://gitter.im/make-sense-ai/community?utm_source=share-link&utm_medium=link&utm_campaign=share-link
[6]: https://github.com/SkalskiP/make-sense/wiki/Road-Map
[7]: https://github.com/SkalskiP/make-sense/wiki/Supported-Output-Formats
