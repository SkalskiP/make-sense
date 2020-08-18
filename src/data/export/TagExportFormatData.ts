import {IExportFormat} from "../../interfaces/IExportFormat";
import {ExportFormatType} from "../enums/ExportFormatType";

export const TagExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.CSV,
        label: "Single CSV file."
    },
    {
        type: ExportFormatType.JSON,
        label: "Single JSON file."
    }
];