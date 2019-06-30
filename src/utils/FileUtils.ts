import {ImageData} from "../store/editor/types";
import uuidv1 from 'uuid/v1';

export class FileUtils {
    public static mapFileDataToImageData(fileData: File): ImageData {
        return {
            id: uuidv1(),
            fileData: fileData,
            loadStatus: false,
            labels: []
        }
    }

    public static loadImage(fileData: File, onSuccess: (image:HTMLImageElement) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.readAsDataURL(fileData);
        reader.onloadend = function(evt: any) {
            const image = new Image();
            image.src = evt.target.result;
            image.onload = () => onSuccess(image);
            image.onerror = () => onFailure();
        }
    }

    public static loadLabelsList(fileData: File, onSuccess: (labels:string[]) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.readAsText(fileData);
        reader.onloadend = function (evt: any) {
            const contents:string = evt.target.result;
            onSuccess(contents.split(/[\r\n]/));
        };
        reader.onerror = () => onFailure();
    }
}