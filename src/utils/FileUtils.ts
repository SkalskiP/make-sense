import {ImageData, LabelRect} from "../store/editor/types";

export class FileUtils {
    public static mapFileDataToImageData(fileData: File): ImageData {
        return {
            id: null,
            fileData: fileData,
            width: null,
            height: null,
            labels: []
        }
    }
}