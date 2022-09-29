import {store} from '../..';

export class AISelector {
    public static getSuggestedLabelList(): string[] {
        return store.getState().ai.suggestedLabelList;
    }

    public static getRejectedSuggestedLabelList(): string[] {
        return store.getState().ai.rejectedSuggestedLabelList;
    }

    public static isAISSDObjectDetectorModelLoaded(): boolean {
        return store.getState().ai.isSSDObjectDetectorLoaded;
    }

    public static isAIYOLOObjectDetectorModelLoaded(): boolean {
        return store.getState().ai.isYOLOV5ObjectDetectorLoaded;
    }

    public static isAIPoseDetectorModelLoaded(): boolean {
        return store.getState().ai.isPoseDetectorLoaded;
    }

    public static isAIDisabled(): boolean {
        return store.getState().ai.isAIDisabled;
    }
}
