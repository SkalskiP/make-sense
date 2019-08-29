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

### Bounding boxes

<p align="center"> 
    <img width="1000" src=".//examples/bbox-demo.gif" alt="bbox">
</p>

### Points

<p align="center"> 
    <img width="1000" src=".//examples/points-demo.gif" alt="points">
</p>

### Polygons

<p align="center"> 
    <img width="1000" src=".//examples/polygon-demo.gif" alt="polygon">
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

Some Windows 10 users may also have problems with running applications locally. The problems can be solved by adding additional dependencies to the project, through a command: `npm install normalize.css --save`. More information about this problem is available in the [#16][4].

## Supported Output Formats

|               | CSV | YOLO | VOC XML | VGG JSON | COCO | PIXEL MASK |
|:-------------:|:---:|:----:|:-------:|:--------:|:----:|:----------:|
| **Point**     | ☑   | ☒    | ☐       | ☐        | ☐    | ☒          |
| **Rect**      | ☑   | ☑    | ☑       | ☐        | ☐    | ☒          |
| **Polygon**   | ☐   | ☒    | ☐       | ☑        | ☐    | ☐          |

**Table 1.** The matrix of supported labels export format, where:
* ☑ - supported format
* ☐ - not yet supported format
* ☒ - format does not make sense for a given label type  



**A .zip package containing files in YOLO format**

<details><summary><i>example of file in YOLO format</i></summary><p>

**Schema:**

`label_index rel_rect_center_x rel_rect_center_y rel_rect_width rel_rect_height`  

**Where:**  

`label_index` - index of the selected label  
`rel_rect_center_x` - horizontal position of the centre of the rect in relation to overall image width, value between [0, 1]  
`rel_rect_center_y` - vertical position of the centre of the rect in relation to overall image height, value between [0, 1]  
`rel_rect_width` - rect width in relation to overall image width, value between [0, 1]  
`rel_rect_height` - rect height in relation to overall image height, value between [0, 1]  

**Example:**  

```
1 0.404528 0.543963 0.244094 0.727034
2 0.610236 0.494751 0.188976 0.437008
1 0.754921 0.791339 0.354331 0.413386
```
</p></details>

**A .zip package containing files in Pascal VOC XML format**

<details><summary><i>example of file in Pascal VOC XML format</i></summary><p>

**Schema:**

```xml
<annotation>
    <folder>{ project_name }</folder>
    <filename>{ image_name }</filename>
    <path>{ /project_name/file_name }</path>
    <source>
        <database>Unspecified</database>
    </source>
    <size>
        <width>{ image_width }</width>
        <height>{ image_height }</height>
        <depth>3</depth>
    </size>
    <object>
        <name>{ label_name }</name>
        <pose>Unspecified</pose>
        <truncated>Unspecified</truncated>
        <difficult>Unspecified</difficult>
        <bndbox>
            <xmin>{ rect_left }</xmin>
            <ymin>{ rect_top }</ymin>
            <xmax>{ rect_right }</xmax>
            <ymax>{ rect_bottom }</ymax>
        </bndbox>
    </object>
</annotation>
```

**Where:**  

`project_name` - user-defined project name  
`image_name` - name of the photo file  
`label_name` - selected label name  
`rect_left` - absolute horizontal distance between the left edge of the image and the left edge of the rect in pixels  
`rect_top` - absolute vertical distance between the top edge of the image and the top edge of the rect in pixels  
`rect_right` - absolute horizontal distance between the left edge of the image and the right edge of the rect in pixels  
`rect_bottom` - absolute vertical distance between the top edge of the image and the bottom edge of the rect in pixels
`image_width` - absolute image width in pixels  
`image_height` - absolute image height in pixels  

**Example:** 

```xml
<annotation>
	<folder>my-project-name</folder>
	<filename>000007.jpg</filename>
	<path>/my-project-name/000007.jpg</path>
	<source>
		<database>Unspecified</database>
	</source>
	<size>
		<width>1280</width>
		<height>960</height>
		<depth>3</depth>
	</size>
	<object>
		<name>kiwi</name>
		<pose>Unspecified</pose>
		<truncated>Unspecified</truncated>
		<difficult>Unspecified</difficult>
		<bndbox>
			<xmin>208</xmin>
			<ymin>486</ymin>
			<xmax>497</xmax>
			<ymax>718</ymax>
		</bndbox>
	</object>
	<object>
		<name>banaba</name>
		<pose>Unspecified</pose>
		<truncated>Unspecified</truncated>
		<difficult>Unspecified</difficult>
		<bndbox>
			<xmin>643</xmin>
			<ymin>118</ymin>
			<xmax>1178</xmax>
			<ymax>799</ymax>
		</bndbox>
	</object>
</annotation>
```
</p></details>

**Single CSV file**

<details><summary><i>example of CSV file</i></summary><p>

**Schema:**

`label_name,rect_left,rect_top,rect_width,rect_height,image_name,image_width,image_height`

**Where:**  

`label_name` - selected label name   
`rect_left` - absolute horizontal distance between the left edge of the image and the left edge of the rect in pixels  
`rect_top` - absolute vertical distance between the top edge of the image and the top edge of the rect in pixels  
`rect_width` - absolute rect width in pixels  
`rect_height` - absolute rect height in pixels  
`image_width` - absolute image width in pixels  
`image_height` - absolute image height in pixels  

**Example:** 

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

## Road Map

Our application is being actively developed. If you have an idea for a new functionality, please hit us on [Twitter][3] and [Gitter][5] or create an issue where you can describe your concept. In the meantime, see what improvements we are planning for you in the future.

- [X] Export rect labels in Pascal VOC XML format
- [X] Labelling objects using polygons 
- [X] Export polygon labels in VGG JSON format
- [ ] Optimization of the process of loading photos from disk - queuing 
- [ ] Labelling objects using lines
- [ ] Autofill in label selection dropdown
- [ ] Export labels in COCO JSON format
- [ ] Export segmentation labels as image mask
- [ ] Separate tab with settings
- [ ] Support basic image operations like crop and resize
- [ ] Converting video to image frames
- [ ] Keyboard shortcuts to improve productivity 
- [ ] Automatic detection of objects in a photo - all you have to do is to label them
- [ ] OCR labelling
- [ ] Integration with external storage - Amazon S3, Google Drive, Dropbox
- [ ] Copy annotations from previous image into the next one

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
