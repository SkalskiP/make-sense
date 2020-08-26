import {LabelType} from "./enums/LabelType";
import {ILabelFormatData} from "../interfaces/ILabelFormatData";
import {LabelFormatType} from "./enums/LabelFormatType";

export type ImportFormatDataMap = { [s in LabelType]: ILabelFormatData[]; };

export const ImportFormatData: ImportFormatDataMap = {
    "RECT": [
        {
            type: LabelFormatType.COCO_JSON,
            label: "Single file in COCO JSON format."
        }
    ],
    "POINT": [],
    "LINE": [],
    "POLYGON": [
        {
            type: LabelFormatType.COCO_JSON,
            label: "Single file in COCO JSON format."
        }
    ],
    "IMAGE RECOGNITION": []
}