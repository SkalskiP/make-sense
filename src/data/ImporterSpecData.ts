import {AnnotationFormatType} from './enums/AnnotationFormatType';
import {AnnotationImporter} from '../logic/import/AnnotationImporter';
import {COCOImporter} from '../logic/import/coco/COCOImporter';
import {YOLOImporter} from '../logic/import/yolo/YOLOImporter';

export type ImporterSpecDataMap = Record<AnnotationFormatType, typeof AnnotationImporter>;


export const ImporterSpecData: ImporterSpecDataMap = {
    [AnnotationFormatType.COCO]: COCOImporter,
    [AnnotationFormatType.CSV]: undefined,
    [AnnotationFormatType.JSON]: undefined,
    [AnnotationFormatType.VGG]: undefined,
    [AnnotationFormatType.VOC]: undefined,
    [AnnotationFormatType.YOLO]: YOLOImporter
}
