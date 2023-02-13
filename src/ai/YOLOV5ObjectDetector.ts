import {DetectedObject, load, YOLOv5, ModelConfig} from 'yolov5js'
import {store} from '../index';
import {updateYOLOV5ObjectDetectorStatus} from '../store/ai/actionCreators';
import {updateActiveLabelType} from '../store/labels/actionCreators';
import {LabelType} from '../data/enums/LabelType';
import {NotificationUtil} from '../utils/NotificationUtil';
import {NotificationsDataMap} from '../data/info/NotificationsData';
import {Notification} from '../data/enums/Notification';
import {submitNewNotification} from '../store/notifications/actionCreators';
import {LabelsSelector} from '../store/selectors/LabelsSelector';
import {AIYOLOObjectDetectionActions} from '../logic/actions/AIYOLOObjectDetectionActions';
import {ImageData} from '../store/labels/types';
import {ImageRepository} from '../logic/imageRepository/ImageRepository';

export class YOLOV5ObjectDetector {
    private static model: YOLOv5;

    public static loadModel(modelConfig: ModelConfig, onSuccess?: () => any, onFailure?: () => any) {
        const activeImageData: ImageData = LabelsSelector.getActiveImageData();
        const image = ImageRepository.getById(activeImageData.id)
        YOLOV5ObjectDetector.loadModelSafely(modelConfig, image)
            .then((model: YOLOv5) => {
                YOLOV5ObjectDetector.model = model;
                store.dispatch(updateYOLOV5ObjectDetectorStatus(true));
                store.dispatch(updateActiveLabelType(LabelType.RECT));
                const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
                if (activeLabelType === LabelType.RECT) {
                    AIYOLOObjectDetectionActions.detectRectsForActiveImage();
                }
                if (onSuccess) onSuccess()
            })
            .catch((error) => {
                // tslint:disable-next-line:no-console
                console.log(error)
                if (onFailure) onFailure()
            })
    }

    private static loadModelSafely(modelConfig: ModelConfig, image: HTMLImageElement): Promise<YOLOv5> {
        return new Promise( (resolve, reject) => {
            load(modelConfig, [640, 640])
                .then((model640: YOLOv5) => {
                    model640.detect(image)
                        .then((detections: DetectedObject[]) => resolve(model640))
                        .catch((error: Error) => {
                            load(modelConfig, [1280, 1280])
                                .then((model1280: YOLOv5) => {
                                    model1280.detect(image)
                                        .then((detections: DetectedObject[]) => resolve(model1280))
                                        .catch(reject)
                                })
                                .catch(reject)
                        })
                })
                .catch(reject)
        });
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: DetectedObject[]) => any) {
        if (!YOLOV5ObjectDetector.model) return;

        YOLOV5ObjectDetector.model
            .detect(image)
            .then((predictions: DetectedObject[]) => {
                if (callback) {
                    callback(predictions)
                }
            })
            .catch((error) => {
                // tslint:disable-next-line:no-console
                console.log(error)
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
