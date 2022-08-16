# Import Formats

|             | csv | yolo | voc xml | vgg json | coco json |
|:-----------:|:---:|:----:|:-------:|:--------:|:---------:|
|  **point**  |  ✓  |  ✗   |    ☐    |    ☐     |     ☐     |
|  **line**   |  ☐  |  ✗   |    ✗    |    ✗     |     ✗     | 
|  **rect**   |  ☐  |  ✓   |    ☐    |    ☐     |     ✓     |
| **polygon** |  ☐  |  ✗   |    ☐    |    ☐     |     ✓     |
|  **label**  |  ☐  |  ✗   |    ✗    |    ✗     |     ✗     |

**Table 1.** The matrix of supported labels import formats, where:

- ✓ - supported format
- ☐ - not yet supported format
- ✗ - format does not make sense for a given label type

# Point

## csv

| label_name | point_x | point_y | image_name | image_width | image_height |
|:----------:|:-------:|:-------:|:----------:|:-----------:|:------------:|
|   person   |   100   |   100   |  0000.jpg  |     720     |     1280     |

**Table 2.** Example of point csv import format

# Rect

## csv

| label_name | bbox_x | bbox_y | bbox_width | bbox_height | image_name | image_width | image_height |
|:----------:|:------:|:------:|:----------:|:-----------:|:----------:|:-----------:|:------------:|
|   person   |  100   |  100   |    100     |     100     |  0000.jpg  |     720     |     1280     |

**Table 3.** Example of rect csv import format
