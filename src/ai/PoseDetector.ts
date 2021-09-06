import '@tensorflow/tfjs-backend-webgl';
import * as posenet from '@tensorflow-models/posenet';
import {PoseNet} from '@tensorflow-models/posenet';
import {Pose} from '@tensorflow-models/posenet';
import {store} from '../index';
import {updatePoseDetectorStatus} from '../store/ai/actionCreators';
import {AIPoseDetectionActions} from '../logic/actions/AIPoseDetectionActions';
import {LabelType} from '../data/enums/LabelType';
import {LabelsSelector} from '../store/selectors/LabelsSelector';
import {updateActiveLabelType} from '../store/labels/actionCreators';

export class PoseDetector {
    private static model: PoseNet;

    public static loadModel(callback?: () => any) {
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
                // TODO
                throw new Error(error as string);
            })
    }

    public static predict(image: HTMLImageElement, callback?: (predictions: Pose[]) => any) {
        if (!PoseDetector.model) return;

        PoseDetector.model
            .estimateMultiplePoses(image)
            .then((predictions: Pose[]) => {
                if (callback) {
                    callback(predictions)
                }
            })
            .catch((error) => {
                // TODO
                throw new Error(error as string);
            })
    }
}
