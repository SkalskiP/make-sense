import {ExportFormatType} from "../enums/ExportFormatType";
import {IExportFormat} from "../../interfaces/IExportFormat";

export const PointExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.CSV,
        label: "Single CSV file."
    }
];