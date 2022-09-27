import {max} from "lodash";


export interface DetectedObject {
    bbox: [number, number, number, number];
    class: string;
    score: number;
}


export class RoboflowObjectDetector {
    private static model;

    public static loadModel(
        publishableKey: string,
        modelId: string,
        modelVersion: number,
        onSuccess: () => unknown,
        onError: (error: Error) => unknown
    ) {
        roboflow.auth({
            publishable_key: publishableKey
        }).load({
            model: modelId,
            version: modelVersion
        }).then((model) => {
            RoboflowObjectDetector.model = model
            onSuccess()
        }).catch((error) => {
            onError(error)
        })
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: DetectedObject[]) => unknown) {
        if (!RoboflowObjectDetector.model) return;

        RoboflowObjectDetector.model
            .detect(image)
            .then((predictions) => {
                const processedPredictions: DetectedObject[] = predictions.map((raw) => {
                    return {
                        bbox: [
                            max([raw.bbox.x - raw.bbox.width / 2, 0]),
                            max([raw.bbox.y - raw.bbox.height / 2, 0]),
                            raw.bbox.width,
                            raw.bbox.height
                        ],
                        class: raw.class,
                        score: raw.confidence
                    }
                })
                if (callback) {
                    callback(processedPredictions)
                }
            })
            .catch((error) => {
                // TODO
                throw new Error(error as string);
            })
    }
}
