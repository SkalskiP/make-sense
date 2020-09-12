import {LabelType} from "./enums/LabelType";
import {ILabelFormatData} from "../interfaces/ILabelFormatData";
import {AnnotationFormatType} from "./enums/AnnotationFormatType";

export type ImportFormatDataMap = Record<LabelType, ILabelFormatData[]>

export const ImportFormatData: ImportFormatDataMap = {
    "RECT": [
        {
            type: AnnotationFormatType.COCO,
            label: "Single file in COCO JSON format."
        },
        {
            type: AnnotationFormatType.YOLO,
            label: "Multiple files in YOLO format along with labels names definition - labels.txt file."
        }
    ],
    "POINT": [],
    "LINE": [],
    "POLYGON": [
        {
            type: AnnotationFormatType.COCO,
            label: "Single file in COCO JSON format."
        }
    ],
    "IMAGE RECOGNITION": []
}