import {DetectedObject} from "@tensorflow-models/coco-ssd";
import {ImageData, LabelRect} from "../../store/labels/types";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import uuidv1 from 'uuid/v1';
import {store} from "../../index";
import {updateImageDataById} from "../../store/labels/actionCreators";
import {ObjectDetector} from "../../ai/ObjectDetector";
import {ImageRepository} from "../imageRepository/ImageRepository";
import {LabelStatus} from "../../data/enums/LabelStatus";

export class AIActions {
    public static detectRectsForActiveImage(): void {
        const activeImageData: ImageData = LabelsSelector.getActiveImageData();
        AIActions.detectRects(activeImageData.id, ImageRepository.getById(activeImageData.id))
    }

    public static detectRects(imageId: string, image: HTMLImageElement): void {
        if (LabelsSelector.getImageDataById(imageId).isVisitedByObjectDetector)
            return;

        ObjectDetector.predict(image, (predictions: DetectedObject[]) => {
            AIActions.savePredictions(imageId, predictions);
        })
    }

    public static savePredictions(imageId: string, predictions: DetectedObject[]) {
        const imageData: ImageData = LabelsSelector.getImageDataById(imageId);
        const predictedLabels: LabelRect[] = AIActions.mapPredictionsToRectLabels(predictions);
        const nextImageData: ImageData = {
            ...imageData,
            labelRects: imageData.labelRects.concat(predictedLabels),
            isVisitedByObjectDetector: true
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
                },
                isCreatedByAI: true,
                status: LabelStatus.UNDECIDED
            }
        })
    }
}