import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {GeneralSelector} from "../../../store/selectors/GeneralSelector";
import {ImageRepository} from "../../imageRepository/ImageRepository";
import {ExporterUtil} from "../../../utils/ExporterUtil";
import {COCOAnnotation, COCOCategory, COCOImage, COCOInfo, COCOObject} from "../../../data/labels/COCO";

export type LabelDataMap = { [key: string]: number; }
export type ImageDataMap = { [key: string]: number; }

export class COCOExporter {
    public static export(): void {
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        const labelNames: LabelName[] = LabelsSelector.getLabelNames();
        const projectName: string = GeneralSelector.getProjectName();
        const COCOObject: COCOObject = COCOExporter.mapImagesDataToCOCOObject(imagesData, labelNames, projectName);
        const content: string = JSON.stringify(COCOObject);
        const fileName: string = `${ExporterUtil.getExportFileName()}.json`;
        ExporterUtil.saveAs(content, fileName);
    }

    private static mapImagesDataToCOCOObject(
        imagesData: ImageData[],
        labelNames: LabelName[],
        projectName: string
    ): COCOObject {
        return {
            "info": COCOExporter.getInfoComponent(projectName),
            "images": COCOExporter.getImagesComponent(imagesData),
            "annotations": COCOExporter.getAnnotationsComponent(imagesData, labelNames),
            "categories":COCOExporter.getCategoriesComponent(labelNames)
        }
    }

    public static getInfoComponent(description: string): COCOInfo {
        return {
            "description": description
        }
    }

    public static getCategoriesComponent(labelNames: LabelName[]): COCOCategory[] {
        return labelNames.map((labelName: LabelName, index: number) => {
            return {
                "id": index + 1,
                "name": labelName.name
            }
        })
    }

    public static getImagesComponent(imagesData: ImageData[]): COCOImage[] {
        return imagesData.map((imageData: ImageData, index: number) => {
            const image: HTMLImageElement = ImageRepository.getById(imageData.id);
            return {
                "id": index + 1,
                "width": image.width,
                "height": image.height,
                "file_name": imageData.fileData.name
            }
        })
    }

    public static getAnnotationsComponent(imagesData: ImageData[], labelNames: LabelName[]): COCOAnnotation[] {
        return {};
    }

    public static mapLabelsData(labelNames: LabelName[]): LabelDataMap {
        return labelNames.reduce((data: LabelDataMap, label: LabelName, index: number) => {
            data[label.id] = index + 1;
            return data;
        }, {})
    }

    public static mapImageData(imagesData: ImageData[]): ImageDataMap {
        return imagesData.reduce((data: ImageDataMap, image: ImageData, index: number) => {
            data[image.id] = index + 1;
            return data;
        }, {})
    }
}