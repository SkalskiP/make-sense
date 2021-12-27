import {DetectedObject, load, YOLOv5, YOLO_V5_N_COCO_MODEL_CONFIG} from 'yolov5-js'
import {store} from '../index';
import {updateYOLOObjectDetectorStatus} from '../store/ai/actionCreators';
import {updateActiveLabelType} from '../store/labels/actionCreators';
import {LabelType} from '../data/enums/LabelType';
import {NotificationUtil} from '../utils/NotificationUtil';
import {NotificationsDataMap} from '../data/info/NotificationsData';
import {Notification} from '../data/enums/Notification';
import {submitNewNotification} from '../store/notifications/actionCreators';
import {LabelsSelector} from '../store/selectors/LabelsSelector';
import {AIYOLOObjectDetectionActions} from '../logic/actions/AIYOLOObjectDetectionActions';

export class YOLOObjectDetector {
    private static model: YOLOv5;

    public static loadModel(callback?: () => any) {
        load(YOLO_V5_N_COCO_MODEL_CONFIG)
            .then((model: YOLOv5) => {
                YOLOObjectDetector.model = model;
                store.dispatch(updateYOLOObjectDetectorStatus(true));
                store.dispatch(updateActiveLabelType(LabelType.RECT));
                const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
                if (activeLabelType === LabelType.RECT) {
                    AIYOLOObjectDetectionActions.detectRectsForActiveImage();
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
                            NotificationsDataMap[Notification.MODEL_LOADING_ERROR]
                        )
                    )
                )
            })
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: DetectedObject[]) => any) {
        if (!YOLOObjectDetector.model) return;

        YOLOObjectDetector.model
            .detect(image)
            .then((predictions: DetectedObject[]) => {
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
