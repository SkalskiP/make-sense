import {ExportFormatType} from "./ExportFormatType";

export interface IExportFormat {
    type: ExportFormatType,
    label: string
}

export const ExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.YOLO,
        label: "A .zip package containing files in YOLO format."
    },
    // {
    //     type: ExportFormatType.COCO,
    //     label: "A .zip package containing files in COCO format."
    // },
    {
        type: ExportFormatType.CSV,
        label: "Single CSV file."
    }
]