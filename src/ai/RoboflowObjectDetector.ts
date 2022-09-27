import * as express from 'roboflow';


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
            .then((predictions: DetectedObject[]) => {
                if (callback) {
                    callback(predictions)
                }
            })
            .catch((error) => {
                // TODO
                throw new Error(error as string);
            })
    }
}
