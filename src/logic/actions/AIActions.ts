import { LabelType } from '../../data/enums/LabelType';
import { LabelsSelector } from '../../store/selectors/LabelsSelector';
import { AISSDObjectDetectionActions } from './AISSDObjectDetectionActions';
import { AIPoseDetectionActions } from './AIPoseDetectionActions';
import { ImageData } from '../../store/labels/types';
import { AISelector } from '../../store/selectors/AISelector';
import { AIYOLOObjectDetectionActions } from './AIYOLOObjectDetectionActions';

export class AIActions {
    public static excludeRejectedLabelNames(suggestedLabels: string[], rejectedLabels: string[]): string[] {
        return suggestedLabels.reduce((acc: string[], label: string) => {
            if (!rejectedLabels.includes(label)) {
                acc.push(label);
            }
            return acc;
        }, []);
    }

    public static detect(imageId: string, image: HTMLImageElement): void {
        const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
        const isAIYOLOObjectDetectorModelLoaded = AISelector.isAIYOLOObjectDetectorModelLoaded();
        const isAISSDObjectDetectorModelLoaded = AISelector.isAISSDObjectDetectorModelLoaded();
        switch (activeLabelType) {
            case LabelType.RECT:
                if (isAISSDObjectDetectorModelLoaded) {
                    AISSDObjectDetectionActions.detectRects(imageId, image);
                }
                if (isAIYOLOObjectDetectorModelLoaded) {
                    AIYOLOObjectDetectionActions.detectRects(imageId, image);
                }
                break;
            case LabelType.POINT:
                AIPoseDetectionActions.detectPoses(imageId, image);
                break;
        }
    }

    public static rejectAllSuggestedLabels(imageData: ImageData) {
        const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
        const isAIYOLOObjectDetectorModelLoaded = AISelector.isAIYOLOObjectDetectorModelLoaded();
        const isAISSDObjectDetectorModelLoaded = AISelector.isAISSDObjectDetectorModelLoaded();
        switch (activeLabelType) {
            case LabelType.RECT:
                if (isAISSDObjectDetectorModelLoaded) {
                    AISSDObjectDetectionActions.rejectAllSuggestedRectLabels(imageData);
                }
                if (isAIYOLOObjectDetectorModelLoaded) {
                    AIYOLOObjectDetectionActions.rejectAllSuggestedRectLabels(imageData);
                }
                break;
            case LabelType.POINT:
                AIPoseDetectionActions.rejectAllSuggestedPointLabels(imageData);
                break;
        }
    }

    public static acceptAllSuggestedLabels(imageData: ImageData) {
        const activeLabelType: LabelType = LabelsSelector.getActiveLabelType();
        const isAIYOLOObjectDetectorModelLoaded = AISelector.isAIYOLOObjectDetectorModelLoaded();
        const isAISSDObjectDetectorModelLoaded = AISelector.isAISSDObjectDetectorModelLoaded();
        switch (activeLabelType) {
            case LabelType.RECT:
                if (isAISSDObjectDetectorModelLoaded) {
                    AISSDObjectDetectionActions.acceptAllSuggestedRectLabels(imageData);
                }
                if (isAIYOLOObjectDetectorModelLoaded) {
                    AIYOLOObjectDetectionActions.acceptAllSuggestedRectLabels(imageData);
                }
                break;
            case LabelType.POINT:
                AIPoseDetectionActions.acceptAllSuggestedPointLabels(imageData);
                break;
        }
    }
}
