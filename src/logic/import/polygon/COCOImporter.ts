import {ImageData, LabelName} from "../../../store/labels/types";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";

export type COCOImportResult = {
    imagesData: ImageData[]
    labelNames: LabelName[]
}

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
                const {imagesData, labelNames} = COCOImporter.applyLabels(inputImagesData, annotations);
                onSuccess(imagesData,labelNames);
            } catch (error) {
                onFailure();
            }
        };
        reader.onerror = () => onFailure();
    }

    public static applyLabels(imagesData: ImageData[], annotations: object): COCOImportResult {
        console.log(imagesData);
        console.log(annotations);
        return {
            imagesData: [],
            labelNames: []
        }
    }
}