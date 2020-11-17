import {AnnotationFormatType} from "../../../data/enums/AnnotationFormatType";
import {VGGExporter} from "./VGGExporter";
import {COCOExporter} from "./COCOExporter";
import {VOCExporter} from "./VOCExporter";

export class PolygonLabelsExporter {
    public static export(exportFormatType: AnnotationFormatType): void {
        switch (exportFormatType) {
            case AnnotationFormatType.VOC:
                VOCExporter.export();
                break;
            case AnnotationFormatType.VGG:
                VGGExporter.export();
                break;
            case AnnotationFormatType.COCO:
                COCOExporter.export();
                break;
            default:
                return;
        }
    }
}