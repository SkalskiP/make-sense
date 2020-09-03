import {LabelType} from "./enums/LabelType";
import {ILabelFormatData} from "../interfaces/ILabelFormatData";
import {AnnotationFormatType} from "./enums/AnnotationFormatType";

export type ImportFormatDataMap = { [s in LabelType]: ILabelFormatData[]; };

export const ImportFormatData: ImportFormatDataMap = {
    "RECT": [
        {
            type: AnnotationFormatType.COCO,
            label: "Single file in COCO JSON format."
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