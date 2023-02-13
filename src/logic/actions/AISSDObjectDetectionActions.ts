import {DetectedObject} from '@tensorflow-models/coco-ssd';
import {ImageData, LabelName, LabelRect} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import { v4 as uuidv4 } from 'uuid';
import {store} from '../../index';
import {updateImageDataById} from '../../store/labels/actionCreators';
import {SSDObjectDetector} from '../../ai/SSDObjectDetector';
import {ImageRepository} from '../imageRepository/ImageRepository';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {findLast} from 'lodash';
import {updateSuggestedLabelList} from '../../store/ai/actionCreators';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {updateActivePopupType} from '../../store/general/actionCreators';
import {AISelector} from '../../store/selectors/AISelector';
import {AIActions} from './AIActions';

export class AISSDObjectDetectionActions {
    public static detectRectsForActiveImage(): void {
        const activeImageData: ImageData = LabelsSelector.getActiveImageData();
        AISSDObjectDetectionActions.detectRects(activeImageData.id, ImageRepository.getById(activeImageData.id))
    }

    public static detectRects(imageId: string, image: HTMLImageElement): void {
        if (LabelsSelector.getImageDataById(imageId).isVisitedBySSDObjectDetector
            || !AISelector.isAISSDObjectDetectorModelLoaded())
            return;

        store.dispatch(updateActivePopupType(PopupWindowType.LOADER));
        SSDObjectDetector.predict(image, (predictions: DetectedObject[]) => {
            const suggestedLabelNames = AISSDObjectDetectionActions
                .extractNewSuggestedLabelNames(LabelsSelector.getLabelNames(), predictions);
            const rejectedLabelNames = AISelector.getRejectedSuggestedLabelList();
            const newlySuggestedNames = AIActions.excludeRejectedLabelNames(suggestedLabelNames, rejectedLabelNames);
            if (newlySuggestedNames.length > 0) {
                store.dispatch(updateSuggestedLabelList(newlySuggestedNames));
                store.dispatch(updateActivePopupType(PopupWindowType.SUGGEST_LABEL_NAMES));
            } else {
                store.dispatch(updateActivePopupType(null));
            }
            AISSDObjectDetectionActions.saveRectPredictions(imageId, predictions);
        })
    }

    public static saveRectPredictions(imageId: string, predictions: DetectedObject[]) {
        const imageData: ImageData = LabelsSelector.getImageDataById(imageId);
        const predictedLabels: LabelRect[] = AISSDObjectDetectionActions.mapPredictionsToRectLabels(predictions);
        const nextImageData: ImageData = {
            ...imageData,
            labelRects: imageData.labelRects.concat(predictedLabels),
            isVisitedBySSDObjectDetector: true
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
                    x: prediction.bbox[0],
                    y: prediction.bbox[1],
                    width: prediction.bbox[2],
                    height: prediction.bbox[3],
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
