import * as posenet from '@tensorflow-models/posenet';
import {PoseNet} from '@tensorflow-models/posenet';
import {Pose} from '@tensorflow-models/posenet';
import {store} from '../index';
import {updatePoseDetectorStatus} from '../store/ai/actionCreators';
import {AIPoseDetectionActions} from '../logic/actions/AIPoseDetectionActions';
import {LabelType} from '../data/enums/LabelType';
import {LabelsSelector} from '../store/selectors/LabelsSelector';
import {updateActiveLabelType} from '../store/labels/actionCreators';
import {submitNewNotification} from '../store/notifications/actionCreators';
import {NotificationUtil} from '../utils/NotificationUtil';
import {NotificationsDataMap} from '../data/info/NotificationsData';
import {Notification} from '../data/enums/Notification';

export class PoseDetector {
    private static model: PoseNet;

    public static loadModel(callback?: () => unknown) {
        posenet
            .load({
                architecture: 'ResNet50',
                outputStride: 32,
                inputResolution: 257,
                quantBytes: 2
            })
            .then((model: PoseNet) => {
                PoseDetector.model = model;
                store.dispatch(updatePoseDetectorStatus(true));
                store.dispatch(updateActiveLabelType(LabelType.POINT));
                const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
                if (activeLabelType === LabelType.POINT) {
                    AIPoseDetectionActions.detectPoseForActiveImage();
                }
                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                // TODO: Introduce central logging system like Sentry
                store.dispatch(
                    submitNewNotification(
                        NotificationUtil.createErrorNotification(
                            NotificationsDataMap[Notification.MODEL_DOWNLOAD_ERROR]
                        )
                    )
                )
            })
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: Pose[]) => unknown) {
        if (!PoseDetector.model) return;

        PoseDetector.model
            .estimateMultiplePoses(image)
            .then((predictions: Pose[]) => {
                if (callback) {
                    callback(predictions)
                }
            })
            .catch((error) => {
                // TODO: Introduce central logging system like Sentry
                store.dispatch(
                    submitNewNotification(
                        NotificationUtil.createErrorNotification(
                            NotificationsDataMap[Notification.MODEL_INFERENCE_ERROR]
                        )
                    )
                )
            })
    }
}
