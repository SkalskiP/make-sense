import '@tensorflow/tfjs-backend-cpu';
import {Detection, load, YOLOv5} from 'yolov5-js'
import {store} from '../index';
import {updateYOLOObjectDetectorStatus} from '../store/ai/actionCreators';
import {updateActiveLabelType} from '../store/labels/actionCreators';
import {LabelType} from '../data/enums/LabelType';
import {NotificationUtil} from '../utils/NotificationUtil';
import {NotificationsDataMap} from '../data/info/NotificationsData';
import {Notification} from '../data/enums/Notification';
import {submitNewNotification} from '../store/notifications/actionCreators';

export class YOLOObjectDetector {
    private static model: YOLOv5;

    public static loadModel(callback?: () => any) {
        load()
            .then((model: YOLOv5) => {
                YOLOObjectDetector.model = model;
                store.dispatch(updateYOLOObjectDetectorStatus(true));
                store.dispatch(updateActiveLabelType(LabelType.RECT));

                // tslint:disable-next-line:no-console
                console.log(model.model)
                // tslint:disable-next-line:no-console
                console.log(model.resolution)
                // tslint:disable-next-line:no-console
                console.log(model.names)

                if (callback) {
                    callback();
                }
            })
            .catch((error) => {
                // tslint:disable-next-line:no-console
                console.log(error)
                store.dispatch(
                    submitNewNotification(
                        NotificationUtil.createErrorNotification(
                            NotificationsDataMap[Notification.EMPTY_LABEL_NAME_ERROR]
                        )
                    )
                )
                return
            })
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: Detection[]) => any) {
        // tslint:disable-next-line:no-console
        console.log('predict')
    }
}
