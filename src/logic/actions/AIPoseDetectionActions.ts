import {PoseDetector} from '../../ai/PoseDetector';
import {Keypoint, Pose} from '@tensorflow-models/posenet';
import {ImageData, LabelName, LabelPoint} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {ImageRepository} from '../imageRepository/ImageRepository';
import {LabelStatus} from '../../data/enums/LabelStatus';
import { v4 as uuidv4 } from 'uuid';
import {store} from '../../index';
import {updateImageDataById} from '../../store/labels/actionCreators';
import {findLast} from 'lodash';
import {AISelector} from '../../store/selectors/AISelector';
import {AIActions} from './AIActions';
import {updateSuggestedLabelList} from '../../store/ai/actionCreators';
import {updateActivePopupType} from '../../store/general/actionCreators';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {NumberUtil} from '../../utils/NumberUtil';

export class AIPoseDetectionActions {
    public static detectPoseForActiveImage(): void {
        const activeImageData: ImageData = LabelsSelector.getActiveImageData();
        AIPoseDetectionActions.detectPoses(activeImageData.id, ImageRepository.getById(activeImageData.id))
    }

    public static detectPoses(imageId: string, image: HTMLImageElement): void {
        if (LabelsSelector.getImageDataById(imageId).isVisitedByPoseDetector
            || !AISelector.isAIPoseDetectorModelLoaded())
            return;

        store.dispatch(updateActivePopupType(PopupWindowType.LOADER));
        PoseDetector.predict(image, (poses: Pose[]) => {
            const suggestedLabelNames = AIPoseDetectionActions
                .extractNewSuggestedLabelNames(LabelsSelector.getLabelNames(), poses);
            const rejectedLabelNames = AISelector.getRejectedSuggestedLabelList();
            const newlySuggestedNames = AIActions.excludeRejectedLabelNames(suggestedLabelNames, rejectedLabelNames);
            if (newlySuggestedNames.length > 0) {
                store.dispatch(updateSuggestedLabelList(newlySuggestedNames));
                store.dispatch(updateActivePopupType(PopupWindowType.SUGGEST_LABEL_NAMES));
            } else {
                store.dispatch(updateActivePopupType(null));
            }
            AIPoseDetectionActions.savePosePredictions(imageId, poses, image);
        })
    }

    public static savePosePredictions(imageId: string, predictions: Pose[], image: HTMLImageElement) {
        const imageData: ImageData = LabelsSelector.getImageDataById(imageId);
        const predictedLabels: LabelPoint[] = AIPoseDetectionActions
            .mapPredictionsToPointLabels(predictions)
            .filter((labelPoint: LabelPoint) => NumberUtil.isValueInRange(labelPoint.point.x, 0, image.width))
            .filter((labelPoint: LabelPoint) => NumberUtil.isValueInRange(labelPoint.point.y, 0, image.height))
        const nextImageData: ImageData = {
            ...imageData,
            labelPoints: imageData.labelPoints.concat(predictedLabels),
            isVisitedByPoseDetector: true
        };
        store.dispatch(updateImageDataById(imageData.id, nextImageData));
    }

    private static mapPredictionsToPointLabels(predictions: Pose[]): LabelPoint[] {
        return predictions
            .map((prediction: Pose) => {
                return prediction.keypoints
                    .map((keypoint: Keypoint) => {
                        return {
                            id: uuidv4(),
                            labelIndex: null,
                            labelId: null,
                            point: {
                                x: keypoint.position.x,
                                y: keypoint.position.y
                            },
                            isVisible: true,
                            isCreatedByAI: true,
                            status: LabelStatus.UNDECIDED,
                            suggestedLabel: keypoint.part
                        }
                    })
            })
            .reduce((acc: LabelPoint[], item: LabelPoint[]) => {
                return acc.concat(item);
            }, [])
    }

    public static extractNewSuggestedLabelNames(labels: LabelName[], predictions: Pose[]): string[] {
        return predictions
            .map((pose: Pose) => pose.keypoints)
            .reduce((acc: Keypoint[], item: Keypoint[]) => {
                return acc.concat(item);
            }, [])
            .map((keypoint: Keypoint) => keypoint.part)
            .reduce((acc: string[], name: string) => {
                if (!acc.includes(name) && !findLast(labels, {name})) {
                    acc.push(name)
                }
                return acc;
            }, [])
    }

    public static acceptAllSuggestedPointLabels(imageData: ImageData) {
        const newImageData: ImageData = {
            ...imageData,
            labelPoints: imageData.labelPoints.map((labelPoint: LabelPoint) => {
                const labelName: LabelName = findLast(LabelsSelector.getLabelNames(), {name: labelPoint.suggestedLabel});
                return {
                    ...labelPoint,
                    status: LabelStatus.ACCEPTED,
                    labelId: !!labelName ? labelName.id : labelPoint.labelId
                }
            })
        };
        store.dispatch(updateImageDataById(newImageData.id, newImageData));
    }

    public static rejectAllSuggestedPointLabels(imageData: ImageData) {
        const newImageData: ImageData = {
            ...imageData,
            labelPoints: imageData.labelPoints.filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED)
        };
        store.dispatch(updateImageDataById(newImageData.id, newImageData));
    }
}
