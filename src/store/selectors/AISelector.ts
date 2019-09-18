import {store} from "../..";

export class AISelector {
    public static isAiModelLoaded(): boolean {
        return store.getState().ai.isObjectDetectorLoaded;
    }
}