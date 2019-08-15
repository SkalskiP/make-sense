import {store} from "../..";
import {ImageData} from "../editor/types";

export class EditorSelector {
    public static getProjectName(): string {
        return store.getState().editor.projectName;
    }

    public static getLabelNames(): string[] {
        return store.getState().editor.labelNames;
    }

    public static getImagesData(): ImageData[] {
        return store.getState().editor.imagesData;
    }
}