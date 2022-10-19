## Supported import Formats

|               | CSV | YOLO | VOC XML | VGG JSON | COCO JSON | PIXEL MASK |
|:-------------:|:---:|:----:|:-------:|:--------:|:---------:|:----------:|
| **Point**     | ☐   | ✗    | ☐       | ☐        | ☐         | ✗          |
| **Line**      | ☐   | ✗    | ✗       | ✗        | ✗         | ✗          |
| **Rect**      | ☐   | ✓    | ☐       | ☐        | ✓         | ✗          |
| **Polygon**   | ☐   | ✗    | ☐       | ☐        | ✓         | ☐          |
| **Label**     | ☐   | ✗    | ✗       | ✗        | ✗         | ✗          |

**Table 1.** The matrix of supported labels import formats, where:

- ✓ - supported format
- ☐ - not yet supported format
- ✗ - format does not make sense for a given label type  

## YOLO { id="yolo" }

1. Load :material-file-image: images. For the sake of the example, let us assume that the images have the following names: `image-001.png`, `image-002.png` and `image-003.png`.

2. Load :material-file-code: annotations. In YOLO format, each image should have an associated annotations file. The name of the annotation file must be the same as the image name, except that the annotation file must have `.txt` extension. So in ou example, we would have the following annotations files: `image-001.txt`, `image-002.txt` and `image-003.txt`.

3. In addition, we need to provide one more file - :material-file-code: `labels.txt`. This file contains object class names separated by newline characters. Here's an [example](https://github.com/SkalskiP/make-sense/files/9824406/labels.txt) for COCO dataset.
