import {ILabelFormatData} from "../interfaces/ILabelFormatData";
import {LabelType} from "./enums/LabelType";
import {AnnotationFormatType} from "./enums/AnnotationFormatType";

export type ExportFormatDataMap = { [s in LabelType]: ILabelFormatData[]; };

export const ExportFormatData: ExportFormatDataMap = {
    "RECT": [
        {
            type: AnnotationFormatType.YOLO,
            label: "A .zip package containing files in YOLO format."
        },
        {
            type: AnnotationFormatType.VOC,
            label: "A .zip package containing files in VOC XML format."
        },
        {
            type: AnnotationFormatType.CSV,
            label: "Single CSV file."
        },
    ],
    "POINT": [
        {
            type: AnnotationFormatType.CSV,
            label: "Single CSV file."
        },
    ],
    "LINE": [
        {
            type: AnnotationFormatType.CSV,
            label: "Single CSV file."
        },
    ],
    "POLYGON": [
        {
            type: AnnotationFormatType.VOC,
            label: "A .zip package containing files in VOC XML format."
        },
        {
            type: AnnotationFormatType.VGG,
            label: "Single file in VGG JSON format."
        },
        {
            type: AnnotationFormatType.COCO,
            label: "Single file in COCO JSON format."
        },
    ],
    "IMAGE RECOGNITION": [
        {
            type: AnnotationFormatType.CSV,
            label: "Single CSV file."
        },
        {
            type: AnnotationFormatType.JSON,
            label: "Single JSON file."
        },
    ]
}