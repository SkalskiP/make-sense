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

export type COCOImportResult = {
    imagesData: ImageData[]
    labelNames: LabelName[]
}

export type FileNameCOCOIdMap = {[ fileName: string]: number; }
export type LabelNameMap = { [labelCOCOId: number]: LabelName; }
export type ImageDataMap = { [imageCOCOId: number]: ImageData; }

export class COCOImporter {
    public static import(
        fileData: File,
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: () => any
    ): void {
        const reader = new FileReader();
        reader.readAsText(fileData);
        reader.onloadend = function (evt: any) {
            try {
                const inputImagesData: ImageData[] = LabelsSelector.getImagesData();
                const annotations: object = JSON.parse(evt.target.result);
                const {imagesData, labelNames} = COCOImporter.applyLabels(inputImagesData, annotations as COCOObject);
                onSuccess(imagesData,labelNames);
            } catch (error) {
                onFailure();
            }
        };
        reader.onerror = () => onFailure();
    }

    public static applyLabels(imageData: ImageData[], annotationsObject: COCOObject): COCOImportResult {
        const {images, categories, annotations} = annotationsObject;
        const labelNameMap: LabelNameMap = COCOImporter.mapCOCOCategories(categories);
        const cleanImageData: ImageData[] = imageData.map((item: ImageData) => ImageDataUtil.cleanAnnotations(item));
        const imageDataPartition: PartitionResult<ImageData> = COCOImporter.partitionImageData(cleanImageData, images);
        const imageDataMap: ImageDataMap = COCOImporter.mapImageData(imageDataPartition.pass, images);

        for (const annotation of annotations) {
            imageDataMap[annotation.image_id].labelRects.push(LabelUtil.createLabelRect(
                labelNameMap[annotation.category_id].id,
                COCOImporter.bbox2rect(annotation.bbox)
            ))
            imageDataMap[annotation.image_id].labelPolygons.push(LabelUtil.createLabelPolygon(
                labelNameMap[annotation.category_id].id,
                COCOImporter.segmentation2vertices(annotation.segmentation)
            ))
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

    public static segmentation2vertices(segmentation: COCOSegmentation): IPoint[] {
        return chunk(segmentation[0], 2).map((pair: number[]) => {
            return {x: pair[0], y: pair[1]}
        })
    }
}