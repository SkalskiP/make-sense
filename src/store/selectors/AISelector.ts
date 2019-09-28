import {store} from "../..";

export class AISelector {
    public static getSuggestedLabelList(): string[] {
        return store.getState().ai.suggestedLabelList;
    }

    public static getRejectedSuggestedLabelList(): string[] {
        return store.getState().ai.rejectedSuggestedLabelList;
    }

    public static isAIModelLoaded(): boolean {
        return store.getState().ai.isObjectDetectorLoaded;
    }

    public static isAIDisabled(): boolean {
        return store.getState().ai.isAIDisabled;
    }
}