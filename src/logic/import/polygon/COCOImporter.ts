import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {COCOAnnotation, COCOCategory, COCOImage, COCOObject} from "../../../data/labels/COCO";
import uuidv1 from 'uuid/v1';
import {ArrayUtil, PartitionResult} from "../../../utils/ArrayUtil";

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

    public static applyLabels(inputImagesData: ImageData[], annotationsObject: COCOObject): COCOImportResult {
        const {info, images, categories, annotations} = annotationsObject;
        const labelNameMap: LabelNameMap = COCOImporter.mapCOCOCategories(categories);
        const imageDataPartition: PartitionResult<ImageData> = COCOImporter.partitionImageData(inputImagesData, images);
        const imageDataMap: ImageDataMap = COCOImporter.mapImageData(imageDataPartition.pass, images);
        console.log(imageDataMap);
        return {
            imagesData: [],
            labelNames: []
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
}