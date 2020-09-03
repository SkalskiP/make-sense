import {AnnotationFormatType} from "./enums/AnnotationFormatType";
import {AnnotationImporter} from "../logic/import/AnnotationImporter";
import {COCOImporter} from "../logic/import/polygon/COCOImporter";

export type ImporterSpecDataMap = { [s in AnnotationFormatType]: typeof AnnotationImporter; };


export const ImporterSpecData: ImporterSpecDataMap = {
    COCO: COCOImporter,
    CSV: undefined,
    JSON: undefined,
    VGG: undefined,
    VOC: undefined,
    YOLO: undefined
}