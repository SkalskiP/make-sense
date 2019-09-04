import {IExportFormat} from "../../interfaces/IExportFormat";
import {ExportFormatType} from "../enums/ExportFormatType";

export const PolygonExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.VGG_JSON,
        label: "Single file in VGG JSON format."
    }
];