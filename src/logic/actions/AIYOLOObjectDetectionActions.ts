import {ImageData, LabelName, LabelRect} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {ImageRepository} from '../imageRepository/ImageRepository';
import {AISelector} from '../../store/selectors/AISelector';
import {DetectedObject} from 'yolov5js';
import {findLast} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {store} from '../../index';
import {updateImageDataById} from '../../store/labels/actionCreators';
import {updateActivePopupType} from '../../store/general/actionCreators';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {AIActions} from './AIActions';
import {updateSuggestedLabelList} from '../../store/ai/actionCreators';
import {YOLOV5ObjectDetector} from '../../ai/YOLOV5ObjectDetector';

export class AIYOLOObjectDetectionActions {
    public static detectRectsForActiveImage(): void {
        const activeImageData: ImageData = LabelsSelector.getActiveImageData();
        AIYOLOObjectDetectionActions.detectRects(activeImageData.id, ImageRepository.getById(activeImageData.id))
    }

    public static detectRects(imageId: string, image: HTMLImageElement): void {
        if (LabelsSelector.getImageDataById(imageId).isVisitedByYOLOObjectDetector
            || !AISelector.isAIYOLOObjectDetectorModelLoaded())
            return;

        store.dispatch(updateActivePopupType(PopupWindowType.LOADER));
        YOLOV5ObjectDetector.predict(image, (predictions: DetectedObject[]) => {
            const suggestedLabelNames = AIYOLOObjectDetectionActions
                .extractNewSuggestedLabelNames(LabelsSelector.getLabelNames(), predictions);
            const rejectedLabelNames = AISelector.getRejectedSuggestedLabelList();
            const newlySuggestedNames = AIActions.excludeRejectedLabelNames(suggestedLabelNames, rejectedLabelNames);
            if (newlySuggestedNames.length > 0) {
                store.dispatch(updateSuggestedLabelList(newlySuggestedNames));
                store.dispatch(updateActivePopupType(PopupWindowType.SUGGEST_LABEL_NAMES));
            } else {
                store.dispatch(updateActivePopupType(null));
            }
            AIYOLOObjectDetectionActions.saveRectPredictions(imageId, predictions);
        })
    }

    public static saveRectPredictions(imageId: string, predictions: DetectedObject[]) {
        const imageData: ImageData = LabelsSelector.getImageDataById(imageId);
        const predictedLabels: LabelRect[] = AIYOLOObjectDetectionActions.mapPredictionsToRectLabels(predictions);
        const nextImageData: ImageData = {
            ...imageData,
            labelRects: imageData.labelRects.concat(predictedLabels),
            isVisitedByYOLOObjectDetector: true
        };
        store.dispatch(updateImageDataById(imageData.id, nextImageData));
    }

    private static mapPredictionsToRectLabels(predictions: DetectedObject[]): LabelRect[] {
        return predictions.map((prediction: DetectedObject) => {
            return {
                id: uuidv4(),
                labelIndex: null,
                labelId: null,
                rect: {
                    x: prediction.x,
                    y: prediction.y,
                    width: prediction.width,
                    height: prediction.height,
                },
                isVisible: true,
                isCreatedByAI: true,
                status: LabelStatus.UNDECIDED,
                suggestedLabel: prediction.class
            }
        })
    }

    public static extractNewSuggestedLabelNames(labels: LabelName[], predictions: DetectedObject[]): string[] {
        return predictions.reduce((acc: string[], prediction: DetectedObject) => {
            if (!acc.includes(prediction.class) && !findLast(labels, {name: prediction.class})) {
                acc.push(prediction.class)
            }
            return acc;
        }, [])
    }

    public static acceptAllSuggestedRectLabels(imageData: ImageData) {
        const newImageData: ImageData = {
            ...imageData,
            labelRects: imageData.labelRects.map((labelRect: LabelRect) => {
                const labelName: LabelName = findLast(LabelsSelector.getLabelNames(), {name: labelRect.suggestedLabel});
                return {
                    ...labelRect,
                    status: LabelStatus.ACCEPTED,
                    labelId: !!labelName ? labelName.id : labelRect.labelId
                }
            })
        };
        store.dispatch(updateImageDataById(newImageData.id, newImageData));
    }

    public static rejectAllSuggestedRectLabels(imageData: ImageData) {
        const newImageData: ImageData = {
            ...imageData,
            labelRects: imageData.labelRects.filter((labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED)
        };
        store.dispatch(updateImageDataById(newImageData.id, newImageData));
    }
}
