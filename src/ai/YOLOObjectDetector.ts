import '@tensorflow/tfjs-backend-cpu';
import {Detection, load, YOLOv5} from 'yolov5-js'

export class YOLOObjectDetector {
    private static model: YOLOv5;

    public static loadModel(callback?: () => any) {
        load()
    }
}
