import {LabelFormatType} from "../../../data/enums/LabelFormatType";
import {VGGExporter} from "./VGGExporter";
import {COCOExporter} from "./COCOExporter";

export class PolygonLabelsExporter {
    public static export(exportFormatType: LabelFormatType): void {
        switch (exportFormatType) {
            case LabelFormatType.VGG_JSON:
                VGGExporter.export();
                break;
            case LabelFormatType.COCO_JSON:
                COCOExporter.export();
                break;
            default:
                return;
        }
    }
}