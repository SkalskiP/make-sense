import {ExportFormatType} from "../data/enums/ExportFormatType";

export interface IExportFormat {
    type: ExportFormatType,
    label: string
}