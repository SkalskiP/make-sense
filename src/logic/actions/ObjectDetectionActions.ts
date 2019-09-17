import {DetectedObject} from "@tensorflow-models/coco-ssd";
import {ImageData, LabelRect} from "../../store/labels/types";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import uuidv1 from 'uuid/v1';
import {store} from "../../index";
import {updateImageDataById} from "../../store/labels/actionCreators";
import {ObjectDetector} from "../../ai/ObjectDetector";

export class ObjectDetectionActions {
    public static detectRects(imageId: string, image: HTMLImageElement) {
        console.log("ObjectDetectionActions.detectRects")
        ObjectDetector.predict(image, (predictions: DetectedObject[]) => {
            ObjectDetectionActions.savePredictions(imageId, predictions);
        })
    }

    public static savePredictions(imageId: string, predictions: DetectedObject[]) {
        console.log("ObjectDetectionActions.savePredictions")
        const imageData: ImageData = LabelsSelector.getImageDataById(imageId);
        const predictedLabels: LabelRect[] = ObjectDetectionActions.mapPredictionsToRectLabels(predictions);
        const nextImageData: ImageData = {
            ...imageData,
            labelRects: imageData.labelRects.concat(predictedLabels)
        };
        store.dispatch(updateImageDataById(imageData.id, nextImageData));
    }

    public static mapPredictionsToRectLabels(predictions: DetectedObject[]): LabelRect[] {
        return predictions.map((prediction: DetectedObject) => {
            return {
                id: uuidv1(),
                labelIndex: null,
                rect: {
                    x: prediction.bbox[0],
                    y: prediction.bbox[1],
                    width: prediction.bbox[2],
                    height: prediction.bbox[3],
                }
            }
        })
    }
}