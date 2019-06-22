import {ImageData} from "../store/editor/types";
import uuidv1 from 'uuid/v1';

export class FileUtils {
    public static mapFileDataToImageData(fileData: File): ImageData {
        return {
            id: uuidv1(),
            fileData: fileData,
            width: null,
            height: null,
            labels: []
        }
    }
}