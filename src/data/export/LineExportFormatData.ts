import {IExportFormat} from "../../interfaces/IExportFormat";
import {ExportFormatType} from "../enums/ExportFormatType";

export const LineExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.CSV,
        label: "Single CSV file."
    }
];