import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {ObjectDetection} from "@tensorflow-models/coco-ssd";
import {DetectedObject} from "@tensorflow-models/coco-ssd";

export class ObjectDetector {
    private static model: ObjectDetection;

    public static loadModel() {
        cocoSsd
            .load()
            .then((model: ObjectDetection) => {
                ObjectDetector.model = model;
                console.log(model);
                console.log("loaded")
            })
            .catch()
    }

    public static predict(image: HTMLImageElement, callback: (predictions: DetectedObject[]) => any) {
        console.log("ObjectDetector.predict")
        if (!ObjectDetector.model) return;

        ObjectDetector.model
            .detect(image)
            .then((predictions: DetectedObject[]) => {
                console.log(predictions)
                callback(predictions)
            })
            .catch()
    }
}