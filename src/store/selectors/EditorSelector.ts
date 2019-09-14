import {store} from "../..";
import {ImageData, LabelPoint, LabelPolygon, LabelRect} from "../editor/types";
import _ from "lodash";

export class EditorSelector {
    public static getProjectName(): string {
        return store.getState().editor.projectName;
    }

    public static getLabelNames(): string[] {
        return store.getState().editor.labelNames;
    }

    public static getActiveLabelNameIndex(): number {
        return store.getState().editor.activeLabelNameIndex;
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

        return EditorSelector.getImageDataByIndex(activeImageIndex);
    }

    public static getImageDataByIndex(index: number): ImageData {
        const imagesData: ImageData[] = EditorSelector.getImagesData();
        return imagesData[index];
    }

    public static getImageDataById(id: string): ImageData {
        const imagesData: ImageData[] = EditorSelector.getImagesData();
        return _.find(imagesData, {id: id});
    }

    public static getActiveLabelId(): string | null {
        return store.getState().editor.activeLabelId;
    }

    public static getHighlightedLabelId(): string | null {
        return store.getState().editor.highlightedLabelId;
    }

    public static getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string | null = EditorSelector.getActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(EditorSelector.getActiveImageData().labelRects, {id: activeLabelId});
    }

    public static getActivePointLabel(): LabelPoint | null {
        const activeLabelId: string | null = EditorSelector.getActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(EditorSelector.getActiveImageData().labelPoints, {id: activeLabelId});
    }

    public static getActivePolygonLabel(): LabelPolygon | null {
        const activeLabelId: string | null = EditorSelector.getActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(EditorSelector.getActiveImageData().labelPolygons, {id: activeLabelId});
    }
}