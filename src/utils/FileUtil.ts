import {LabelName} from "../store/labels/types";
import {YOLOUtils} from "../logic/import/yolo/utils";

export class FileUtil {
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

    public static loadLabelsList(fileData: File, onSuccess: (labels: LabelName[]) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.onloadend = function (evt: any) {
            const content: string = evt.target.result;
            const labelNames = YOLOUtils.parseLabelsNamesFromString(content);
            onSuccess(labelNames);
        };
        reader.onerror = () => onFailure();
        reader.readAsText(fileData);
    }

    public static readFile(fileData: File): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = (event: any) => {
                resolve(event.target.result);
            };
            reader.onerror = reject;
            reader.readAsText(fileData);
        })
    }
}