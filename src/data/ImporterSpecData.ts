import {AnnotationFormatType} from "./enums/AnnotationFormatType";
import {AnnotationImporter} from "../logic/import/AnnotationImporter";
import {COCOImporter} from "../logic/import/coco/importer";
import {YOLOImporter} from "../logic/import/yolo/importer";

export type ImporterSpecDataMap = { [s in AnnotationFormatType]: typeof AnnotationImporter; };


export const ImporterSpecData: ImporterSpecDataMap = {
    COCO: COCOImporter,
    CSV: undefined,
    JSON: undefined,
    VGG: undefined,
    VOC: undefined,
    YOLO: YOLOImporter
}