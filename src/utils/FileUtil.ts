import uuidv1 from 'uuid/v1';
import {ImageData} from "../store/labels/types";

export class FileUtil {
    public static mapFileDataToImageData(fileData: File): ImageData {
        return {
            id: uuidv1(),
            fileData: fileData,
            loadStatus: false,
            labelRects: [],
            labelPoints: [],
            labelPolygons: [],
            isVisitedByObjectDetector: false,
            isVisitedByPoseDetector: false
        }
    }

    public static loadImage(fileData: File, onSuccess: (image:HTMLImageElement) => any, onFailure: () => any): any {
		return new Promise((resolve, reject) => {
			const url = URL.createObjectURL(fileData);
            const image = new Image();
			image.src = url;
			image.onload = () => {
				onSuccess(image);
				resolve();
			};
			image.onerror = () => {
				onFailure();
				reject();
			};
		})

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