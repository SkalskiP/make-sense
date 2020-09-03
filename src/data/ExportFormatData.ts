import {ILabelFormatData} from "../interfaces/ILabelFormatData";
import {LabelType} from "./enums/LabelType";
import {LabelFormatType} from "./enums/LabelFormatType";

export type ExportFormatDataMap = { [s in LabelType]: ILabelFormatData[]; };

export const ExportFormatData: ExportFormatDataMap = {
    "RECT": [
        {
            type: LabelFormatType.YOLO,
            label: "A .zip package containing files in YOLO format."
        },
        {
            type: LabelFormatType.VOC,
            label: "A .zip package containing files in VOC XML format."
        },
        {
            type: LabelFormatType.CSV,
            label: "Single CSV file."
        }
    ],
    "POINT": [
        {
            type: LabelFormatType.CSV,
            label: "Single CSV file."
        }
    ],
    "LINE": [
        {
            type: LabelFormatType.CSV,
            label: "Single CSV file."
        }
    ],
    "POLYGON": [
        {
            type: LabelFormatType.VGG_JSON,
            label: "Single file in VGG JSON format."
        },
        {
            type: LabelFormatType.COCO_JSON,
            label: "Single file in COCO JSON format."
        }
    ],
    "IMAGE RECOGNITION": [
        {
            type: LabelFormatType.CSV,
            label: "Single CSV file."
        },
        {
            type: LabelFormatType.JSON,
            label: "Single JSON file."
        }
    ]
}