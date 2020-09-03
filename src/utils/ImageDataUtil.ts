import {ImageData} from "../store/labels/types";
import uuidv1 from "uuid/v1";

export class ImageDataUtil {
    public static createImageDataFromFileData(fileData: File): ImageData {
        return {
            id: uuidv1(),
            fileData: fileData,
            loadStatus: false,
            labelRects: [],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: [],
            isVisitedByObjectDetector: false,
            isVisitedByPoseDetector: false
        }
    }

    public static cleanAnnotations(item: ImageData): ImageData {
        return {
            ...item,
            labelRects: [],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: []
        }
    }
}