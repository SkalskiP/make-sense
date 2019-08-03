import {ExportFormatType} from "./ExportFormatType";
import {IExportFormat} from "../interfaces/IExportFormat";

export const RectExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.YOLO,
        label: "A .zip package containing files in YOLO format."
    },
    {
        type: ExportFormatType.CSV,
        label: "Single CSV file."
    }
]