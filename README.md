<h1 align="center">makesense.ai</h1>

<p align="center"> 
    <img width="600" src=".//public/img/main-image-dark_alter.png" alt="Logo">
</p>

## Description

[makesense.ai][1] is a free to use online tool for labelling photos. Thanks to the use of a browser it does not require any complicated installation - just visit the website and you are ready to go. It also doesn't matter which operating system you're running on - we do our best to be truly cross-platform. It is perfect for small computer vision deeplearning projects, making the process of preparing a dataset much easier and faster. Prepared labels can be downloaded  in one of multiple supported formats. The application was written in TypeScript and is based on React/Redux duo.

## Road Map

Our application is being actively developed. If you have an idea for a new functionality, please hit us on [Twitter][3] or create an issue where you can describe your concept. In the meantime, see what improvements we are planning for you in the future.

* Optimization of the process of loading photos from disk - queuing 
* Labelling objects using polygons and Bézier curves
* Export labels in COCO JSON format
* Separate tab with settings
* Support basic image operations like crop and resize
* Converting video to image frames
* Keyboard shortcuts to improve productivity 
* Automatic detection of objects in a photo - all you have to do is to label them

## Sneak Peek

<p align="center"> 
    <img width="1000" src=".//examples/alfa-demo.gif" alt="Logo">
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

## Supported Output Formats

* A .zip package containing files in YOLO format

<details><summary><i>example of file in YOLO format</i></summary><p>

`label_index rel_rect_center_x rel_rect_center_y rel_rect_width rel_rect_height`  
`label_index` - index of the selected label  
`rel_rect_center_x` - horizontal position of the centre of the rect in relation to overall image width  
`rel_rect_center_y` - vertical position of the centre of the rect in relation to overall image height  
`rel_rect_width` - rect width in relation to overall image width  
`rel_rect_height` - rect height in relation to overall image height  
```
1 0.404528 0.543963 0.244094 0.727034
2 0.610236 0.494751 0.188976 0.437008
1 0.754921 0.791339 0.354331 0.413386
```
</p></details>

* Single CSV file

<details><summary><i>example of CSV file</i></summary><p>
    
`label_name,rect_left,rect_top,rect_width,rect_height,image_name,image_width,image_height`  

```
banana,491,164,530,614,000000.jpg,1280,960
banana,462,245,466,353,000001.jpg,1280,960
banana,542,477,587,375,000001.jpg,1280,960
banana,636,109,561,695,000007.jpg,1280,960
kiwi,198,477,317,251,000007.jpg,1280,960
kiwi,558,423,219,222,000008.jpg,1280,960
kiwi,758,360,252,236,000008.jpg,1280,960
```
</p></details>

## Privacy

We don't store your images, because we don't send them anywhere in the first place.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE][2] file for details

Copyright (c) 2019-present, Piotr Skalski

[1]: http://makesense.ai
[2]: ./LICENSE
[3]: https://twitter.com/PiotrSkalski92
