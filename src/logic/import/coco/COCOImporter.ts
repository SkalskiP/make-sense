import {ImageData, LabelName} from '../../../store/labels/types';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {COCOCategory, COCOImage, COCOObject} from '../../../data/labels/COCO';
import { v4 as uuidv4 } from 'uuid';
import {ArrayUtil, PartitionResult} from '../../../utils/ArrayUtil';
import {ImageDataUtil} from '../../../utils/ImageDataUtil';
import {LabelUtil} from '../../../utils/LabelUtil';
import {
    COCOAnnotationDeserializationError,
    COCOAnnotationFileCountError,
    COCOAnnotationReadingError,
    COCOFormatValidationError
} from './COCOErrors';
import {LabelType} from '../../../data/enums/LabelType';
import {AnnotationImporter, ImportResult} from '../AnnotationImporter';
import {COCOUtils} from './COCOUtils';
import {Settings} from "../../../settings/Settings";

export type FileNameCOCOIdMap = {[ fileName: string]: number; }
export type LabelNameMap = { [labelCOCOId: number]: LabelName; }
export type ImageDataMap = { [imageCOCOId: number]: ImageData; }

export class COCOImporter extends AnnotationImporter {
    public static requiredKeys = ['images', 'annotations', 'categories']

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        if (filesData.length > 1) {
            onFailure(new COCOAnnotationFileCountError());
        }

        const reader = new FileReader();
        reader.readAsText(filesData[0]);
        reader.onloadend = (evt: any) => {
            try {
                const inputImagesData: ImageData[] = LabelsSelector.getImagesData();
                const annotations = COCOImporter.deserialize(evt.target.result)
                const {imagesData, labelNames} = this.applyLabels(inputImagesData, annotations);
                onSuccess(imagesData,labelNames);
            } catch (error) {
                onFailure(error as Error);
            }
        };
        reader.onerror = () => onFailure(new COCOAnnotationReadingError());
    }

    public static deserialize(text: string): COCOObject {
        try {
            return JSON.parse(text) as COCOObject
        } catch (error) {
            throw new COCOAnnotationDeserializationError()
        }
    }

    public applyLabels(imageData: ImageData[], annotationsObject: COCOObject): ImportResult {
        COCOImporter.validateCocoFormat(annotationsObject);
        const {images, categories, annotations} = annotationsObject;
        const labelNameMap: LabelNameMap = COCOImporter.mapCOCOCategories(categories);
        const cleanImageData: ImageData[] = imageData.map((item: ImageData) => ImageDataUtil.cleanAnnotations(item));
        const imageDataPartition: PartitionResult<ImageData> = COCOImporter.partitionImageData(cleanImageData, images);
        const imageDataMap: ImageDataMap = COCOImporter.mapImageData(imageDataPartition.pass, images);

        for (const annotation of annotations) {
            if (!imageDataMap[annotation.image_id] || annotation.iscrowd === 1)
                continue

            if (this.labelType.includes(LabelType.RECT)) {
                imageDataMap[annotation.image_id].labelRects.push(LabelUtil.createLabelRect(
                    labelNameMap[annotation.category_id].id,
                    COCOUtils.bbox2rect(annotation.bbox)
                ))
            }

            if (this.labelType.includes(LabelType.POLYGON)) {
                const polygons = COCOUtils.segmentation2vertices(annotation.segmentation);
                for (const polygon of polygons) {
                    imageDataMap[annotation.image_id].labelPolygons.push(LabelUtil.createLabelPolygon(
                        labelNameMap[annotation.category_id].id, polygon
                    ))
                }
            }
        }

        const resultImageData = Object.values(imageDataMap).concat(imageDataPartition.fail);

        return {
            imagesData: ImageDataUtil.arrange(resultImageData, imageData.map((item: ImageData) => item.id)),
            labelNames: Object.values(labelNameMap)
        }
    }

    protected static partitionImageData(items: ImageData[], images: COCOImage[]): PartitionResult<ImageData> {
        const imageNames: string[] = images.map((item: COCOImage) => item.file_name);
        const predicate = (item: ImageData) => imageNames.includes(item.fileData.name);
        return ArrayUtil.partition<ImageData>(items, predicate);
    }

    protected static mapCOCOCategories(categories: COCOCategory[]): LabelNameMap {
        return categories.reduce((acc: LabelNameMap, category : COCOCategory, index: number) => {
            acc[category.id] = {
                id: uuidv4(),
                name: category.name,
                color: ArrayUtil.getByInfiniteIndex(Settings.LABEL_COLORS_PALETTE, index)
            }
            return acc
        }, {});
    }

    protected static mapImageData(items: ImageData[], images: COCOImage[]): ImageDataMap {
        const fileNameCOCOIdMap: FileNameCOCOIdMap = images.reduce((acc: FileNameCOCOIdMap, image: COCOImage) => {
            acc[image.file_name] = image.id
            return acc
        }, {});
        return  items.reduce((acc: ImageDataMap, image: ImageData) => {
            acc[fileNameCOCOIdMap[image.fileData.name]] = image
            return acc;
        }, {});
    }

    public static validateCocoFormat(annotationsObject: COCOObject): void {
        const missingKeys = COCOImporter.requiredKeys.filter((key: string) => !annotationsObject.hasOwnProperty(key))
        if (missingKeys.length !== 0) {
            throw new COCOFormatValidationError(`Uploaded file does not contain all required keys: ${missingKeys}`)
        }
    }
}
