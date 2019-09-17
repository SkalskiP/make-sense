import * as cocoSsd from '@tensorflow-models/coco-ssd';
import {ObjectDetection} from "@tensorflow-models/coco-ssd";
import {DetectedObject} from "@tensorflow-models/coco-ssd";
import {store} from "../index";
import {updateObjectDetectorStatus} from "../store/ai/actionCreators";
import {AIActions} from "../logic/actions/AIActions";

export class ObjectDetector {
    private static model: ObjectDetection;

    public static loadModel() {
        cocoSsd
            .load()
            .then((model: ObjectDetection) => {
                ObjectDetector.model = model;
                store.dispatch(updateObjectDetectorStatus(true));
                AIActions.detectRectsForActiveImage();
                console.log(model);
                console.log("loaded")
            })
            .catch((error) => {
                // TODO
                throw new Error(error);
            })
    }

    public static predict(image: HTMLImageElement, callback: (predictions: DetectedObject[]) => any) {
        console.log("ObjectDetector.predict")
        if (!ObjectDetector.model) return;

        ObjectDetector.model
            .detect(image)
            .then((predictions: DetectedObject[]) => {
                console.log(predictions);
                callback(predictions)
            })
            .catch((error) => {
                // TODO
                throw new Error(error);
            })
    }
}