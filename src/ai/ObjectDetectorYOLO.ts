import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';
import {store} from '../index';
import {updateObjectDetectorStatus} from '../store/ai/actionCreators';
import {LabelType} from '../data/enums/LabelType';
import {LabelsSelector} from '../store/selectors/LabelsSelector';
import {AIObjectDetectionActions} from '../logic/actions/AIObjectDetectionActions';
import {updateActiveLabelType} from '../store/labels/actionCreators';
import {DetectedObject, ObjectDetection} from '@tensorflow-models/coco-ssd';
import { AIModel } from '../data/enums/AIModel';

export class ObjectDetectorYolov5 {
    private static model: tf.GraphModel;
    private static width = 640;
    private static height = 640;
    public static AIModel = AIModel.OBJECT_DETECTION;
    private static names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
        'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
        'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
        'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
        'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
        'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
        'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
        'hair drier', 'toothbrush'];
    // private static predictions: DetectedObject[];
    public static async loadModel(callback?: () => any) {
        const path = '/yolov5/model.json';
        await tf.loadGraphModel(path).then((model  ) => {
            ObjectDetectorYolov5.model = model;
            ObjectDetectorYolov5.AIModel= AIModel.OBJECT_DETECTION_YOLOv5;
            store.dispatch(updateObjectDetectorStatus(true));
            store.dispatch(updateActiveLabelType(LabelType.RECT));
            const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
            if (activeLabelType === LabelType.RECT) {
                AIObjectDetectionActions.detectRectsForActiveImage();
            }
            if (callback) {
                callback();
            }
        }).catch((error) => {
            store.dispatch(updateObjectDetectorStatus(false));
            throw new Error(error as string);
        });
    }

    public static imgToTensor(img) {
        const imgTensor = tf.browser.fromPixels(img);
        const originHeight = img.height;
        const originWidth = img.width;
        const inputTensor = tf.image
            .resizeBilinear(imgTensor, [ObjectDetectorYolov5.height, ObjectDetectorYolov5.width])
            .div(255.0)
            .expandDims(0);
        return [inputTensor, originHeight, originWidth];
    }

    public static async predict(image: HTMLImageElement, callback?: (predictions: DetectedObject[]) => any) {
        if (!ObjectDetectorYolov5.model) return;
        tf.engine().startScope();
        const [input, originHeight, originWidth] = ObjectDetectorYolov5.imgToTensor(image);
        const predictions: DetectedObject[] = [];
        const results = await ObjectDetectorYolov5.model.executeAsync(input);
        const boxes = await results[0].dataSync();
        const scores = await results[1].dataSync();
        const classes = await results[2].dataSync();
        const validDetections = await results[3].dataSync();
        for (let i = 0; i < validDetections; i++) {
            let [x1, y1, x2, y2] = boxes.slice(i * 4, (i + 1) * 4);
            x1 *= originWidth;
            x2 *= originWidth;
            y1 *= originHeight;
            y2 *= originHeight;
            const width = x2 - x1;
            const height = y2 - y1;
            const className = ObjectDetectorYolov5.names[classes[i]];
            const score = scores[i];
            predictions.push({
                        bbox: [x1, y1, width, height],
                        class: className,
                        score: score.toFixed(2)
                    });
        }
        tf.dispose(results);
        tf.engine().endScope();
        if (callback) {
            callback(predictions);
        }
    }
}
