import {ImageData} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {ImageRepository} from '../imageRepository/ImageRepository';
import {AISelector} from '../../store/selectors/AISelector';
import {YOLOObjectDetector} from '../../ai/YOLOObjectDetector';
import {DetectedObject} from '../../../../yolov5-js';

export class AIYOLOObjectDetectionActions {
    public static detectRectsForActiveImage(): void {
        const activeImageData: ImageData = LabelsSelector.getActiveImageData();
        AIYOLOObjectDetectionActions.detectRects(activeImageData.id, ImageRepository.getById(activeImageData.id))
    }

    public static detectRects(imageId: string, image: HTMLImageElement): void {
        if (LabelsSelector.getImageDataById(imageId).isVisitedByYOLOObjectDetector
            || !AISelector.isAIYOLOObjectDetectorModelLoaded())
            return;

        YOLOObjectDetector.predict(image, (predictions: DetectedObject[]) => {
            // tslint:disable-next-line:no-console
            console.log(predictions)
        })
    }
}
