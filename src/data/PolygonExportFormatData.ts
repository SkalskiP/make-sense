import {IExportFormat} from "../interfaces/IExportFormat";
import {ExportFormatType} from "./ExportFormatType";

export const PolygonExportFormatData: IExportFormat[] = [
    {
        type: ExportFormatType.VGG,
        label: "Single file in VGG JSON format."
    }
];