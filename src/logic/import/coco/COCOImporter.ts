import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {COCOBBox, COCOCategory, COCOImage, COCOObject, COCOSegmentation} from "../../../data/labels/COCO";
import uuidv1 from 'uuid/v1';
import {ArrayUtil, PartitionResult} from "../../../utils/ArrayUtil";
import {ImageDataUtil} from "../../../utils/ImageDataUtil";
import {LabelUtil} from "../../../utils/LabelUtil";
import {IRect} from "../../../interfaces/IRect";
import {IPoint} from "../../../interfaces/IPoint";
import {chunk} from "lodash";
import {
    CocoAnnotationDeserializationError, CocoAnnotationFileCountError,
    CocoAnnotationReadingError,
    CocoFormatValidationError
} from "./errors";
import {LabelType} from "../../../data/enums/LabelType";
import {AnnotationImporter} from "../AnnotationImporter";

export type COCOImportResult = {
    imagesData: ImageData[]
    labelNames: LabelName[]
}

export type FileNameCOCOIdMap = {[ fileName: string]: number; }
export type LabelNameMap = { [labelCOCOId: number]: LabelName; }
export type ImageDataMap = { [imageCOCOId: number]: ImageData; }

export class COCOImporter extends AnnotationImporter {
    public static requiredKeys = ["images", "annotations", "categories"]

    public import(
        filesData: File[],
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: (error?:Error) => any
    ): void {
        if (filesData.length > 1) {
            onFailure(new CocoAnnotationFileCountError());
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
                onFailure(error);
            }
        };
        reader.onerror = () => onFailure(new CocoAnnotationReadingError());
    }

    public static deserialize(text: string): COCOObject {
        try {
            return JSON.parse(text) as COCOObject
        } catch (error) {
            throw new CocoAnnotationDeserializationError()
        }
    }

    public applyLabels(imageData: ImageData[], annotationsObject: COCOObject): COCOImportResult {
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
                    COCOImporter.bbox2rect(annotation.bbox)
                ))
            }

            if (this.labelType.includes(LabelType.POLYGON)) {
                const polygons = COCOImporter.segmentation2vertices(annotation.segmentation);
                for (const polygon of polygons) {
                    imageDataMap[annotation.image_id].labelPolygons.push(LabelUtil.createLabelPolygon(
                        labelNameMap[annotation.category_id].id, polygon
                    ))
                }
            }
        }

        return {
            imagesData: Object.values(imageDataMap).concat(imageDataPartition.fail),
            labelNames: Object.values(labelNameMap)
        }
    }

    protected static partitionImageData(items: ImageData[], images: COCOImage[]): PartitionResult<ImageData> {
        const imageNames: string[] = images.map((item: COCOImage) => item.file_name);
        const predicate = (item: ImageData) => imageNames.includes(item.fileData.name);
        return ArrayUtil.partition<ImageData>(items, predicate);
    }

    protected static mapCOCOCategories(categories: COCOCategory[]): LabelNameMap {
        return categories.reduce((acc: LabelNameMap, category : COCOCategory) => {
            acc[category.id] = {
                id: uuidv1(),
                name: category.name
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

    public static bbox2rect(bbox: COCOBBox): IRect {
        return {
            x: bbox[0],
            y: bbox[1],
            width: bbox[2],
            height: bbox[3]
        }
    }

    public static segmentation2vertices(segmentation: COCOSegmentation): IPoint[][] {
        return segmentation.map((segment: number[]) => {
            return chunk(segment, 2).map((pair: number[]) => {
                return {x: pair[0], y: pair[1]}
            })
        })
    }

    public static validateCocoFormat(annotationsObject: COCOObject): void {
        const missingKeys = COCOImporter.requiredKeys.filter((key: string) => !annotationsObject.hasOwnProperty(key))
        if (missingKeys.length !== 0) {
            throw new CocoFormatValidationError(`Uploaded file does not contain all required keys: ${missingKeys}`)
        }
    }
}