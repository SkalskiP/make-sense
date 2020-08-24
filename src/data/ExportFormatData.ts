import {IExportFormat} from "../interfaces/IExportFormat";
import {LabelType} from "./enums/LabelType";
import {LabelFormatType} from "./enums/LabelFormatType";

export type ExportFormatDataMap = { [s in LabelType]: IExportFormat[]; };

export const ExportFormatData: ExportFormatDataMap = {
    RECTANGLE: [
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
    POINT: [
        {
            type: LabelFormatType.CSV,
            label: "Single CSV file."
        }
    ],
    LINE: [
        {
            type: LabelFormatType.CSV,
            label: "Single CSV file."
        }
    ],
    POLYGON: [
        {
            type: LabelFormatType.VGG_JSON,
            label: "Single file in VGG JSON format."
        },
        {
            type: LabelFormatType.COCO_JSON,
            label: "Single file in COCO JSON format."
        }
    ],
    NAME: [
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