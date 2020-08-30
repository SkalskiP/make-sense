import {ImageData, LabelName} from "../../../store/labels/types";

export class COCOImporter {
    public static import(
        fileData: File,
        onSuccess: (imagesData: ImageData[], labelNames: LabelName[]) => any,
        onFailure: () => any
    ): void {
        const reader = new FileReader();
        reader.readAsText(fileData);
        reader.onloadend = function (evt: any) {
            const contents:string = evt.target.result;

        };
        reader.onerror = () => onFailure();
    }
}