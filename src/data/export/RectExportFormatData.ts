import {ExportFormatType} from "../enums/ExportFormatType";
import {IExportFormat} from "../../interfaces/IExportFormat";

export const RectExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.YOLO,
        label: "A .zip package containing files in YOLO format."
    },
    {
        type: ExportFormatType.VOC,
        label: "A .zip package containing files in VOC XML format."
    },
    {
        type: ExportFormatType.CSV,
        label: "Single CSV file."
    }
];