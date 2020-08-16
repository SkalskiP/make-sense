import {ExportFormatType} from "../../../data/enums/ExportFormatType";
import {VGGExporter} from "./VGGExporter";
import {COCOExporter} from "./COCOExporter";

export class PolygonLabelsExporter {
    public static export(exportFormatType: ExportFormatType): void {
        switch (exportFormatType) {
            case ExportFormatType.VGG_JSON:
                VGGExporter.export();
                break;
            case ExportFormatType.COCO_JSON:
                COCOExporter.export();
                break;
            default:
                return;
        }
    }
}