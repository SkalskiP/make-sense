import {store} from "../..";
import {ImageData, LabelPoint, LabelRect} from "../editor/types";
import _ from "lodash";

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

    public static getActiveImageIndex(): number {
        return store.getState().editor.activeImageIndex;
    }

    public static getActiveImageData(): ImageData | null {
        const activeImageIndex: number | null = EditorSelector.getActiveImageIndex();

        if (activeImageIndex === null)
            return null;

        const imagesData: ImageData[] = EditorSelector.getImagesData();
        return imagesData[activeImageIndex];
    }

    public static gatActiveLabelId(): string | null {
        return store.getState().editor.activeLabelId;
    }

    public static getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string | null = EditorSelector.gatActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(EditorSelector.getActiveImageData().labelRects, {id: activeLabelId});
    }

    public static getActivePointLabel(): LabelPoint | null {
        const activeLabelId: string | null = EditorSelector.gatActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(EditorSelector.getActiveImageData().labelPoints, {id: activeLabelId});
    }
}