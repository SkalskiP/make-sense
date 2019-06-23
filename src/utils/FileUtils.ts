import {ImageData} from "../store/editor/types";
import uuidv1 from 'uuid/v1';

export class FileUtils {
    public static mapFileDataToImageData(fileData: File): ImageData {
        return {
            id: uuidv1(),
            fileData: fileData,
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
}