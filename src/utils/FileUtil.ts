import uuidv1 from 'uuid/v1';
import { ImageData } from "../store/labels/types";

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

    public static loadImage(fileData: File, onSuccess: (image: HTMLImageElement) => any, onFailure: () => any): any {
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

    public static readAnnotationsCSV(fileData: File, onSuccess: (annotations: Object) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.readAsText(fileData);
        reader.onloadend = function (evt: any) {
            const contents: string = evt.target.result;

            let formatted = {};

            contents.split(/[\r\n]/).forEach(row => {
                let split = row.split(',');

                // If there is a header on row 1, skip it
                try {
                    parseInt(split[split.length - 1])
                } catch (error) {
                    return
                }

                if (formatted[split[0]] === undefined) {
                    formatted[split[0]] = [];
                }

                // 1, 2, 3, 4, 5, 6, 7
                // width,height,class,xmin,ymin,xmax,ymax
                // last two are width, height
                formatted[split[0]].push([
                    parseInt(split[1]),
                    parseInt(split[2]),
                    split[3],
                    parseInt(split[4]),
                    parseInt(split[5]),
                    parseInt(split[6]) - parseInt(split[4]),
                    parseInt(split[7]) - parseInt(split[5])
                ]);
            });

            onSuccess(formatted);
        };
        reader.onerror = () => onFailure();
    }

    public static loadLabelsList(fileData: File, onSuccess: (labels: string[]) => any, onFailure: () => any) {
        const reader = new FileReader();
        reader.readAsText(fileData);
        reader.onloadend = function (evt: any) {
            const contents: string = evt.target.result;
            onSuccess(contents.split(/[\r\n]/));
        };
        reader.onerror = () => onFailure();
    }
}
