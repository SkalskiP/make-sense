import {IExportFormat} from "../interfaces/IExportFormat";
import {ExportFormatType} from "./ExportFormatType";

export const PolygonExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.VGG_JSON,
        label: "Single file in VGG_JSON JSON format."
    }
];