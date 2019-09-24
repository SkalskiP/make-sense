import {store} from "../..";
import {ImageData, LabelName, LabelPoint, LabelPolygon, LabelRect} from "../labels/types";
import _ from "lodash";
import {LabelType} from "../../data/enums/LabelType";

export class LabelsSelector {
    // todo: to be removed
    public static getLabelNames(): string[] {
        return store.getState().labels.labelNames;
    }

    // todo: _ to be removed
    public static getLabelNames_(): LabelName[] {
        return store.getState().labels.labels;
    }

    // todo: to be removed
    public static getActiveLabelNameIndex(): number {
        return store.getState().labels.activeLabelNameIndex;
    }

    public static getActiveLabelNameId(): string {
        return store.getState().labels.activeLabelNameId;
    }

    public static getActiveLabelType(): LabelType {
        return store.getState().labels.activeLabelType;
    }

    public static getImagesData(): ImageData[] {
        return store.getState().labels.imagesData;
    }

    public static getActiveImageIndex(): number {
        return store.getState().labels.activeImageIndex;
    }

    public static getActiveImageData(): ImageData | null {
        const activeImageIndex: number | null = LabelsSelector.getActiveImageIndex();

        if (activeImageIndex === null)
            return null;

        return LabelsSelector.getImageDataByIndex(activeImageIndex);
    }

    public static getImageDataByIndex(index: number): ImageData {
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        return imagesData[index];
    }

    public static getImageDataById(id: string): ImageData {
        const imagesData: ImageData[] = LabelsSelector.getImagesData();
        return _.find(imagesData, {id: id});
    }

    public static getActiveLabelId(): string | null {
        return store.getState().labels.activeLabelId;
    }

    public static getHighlightedLabelId(): string | null {
        return store.getState().labels.highlightedLabelId;
    }

    public static getActiveRectLabel(): LabelRect | null {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(LabelsSelector.getActiveImageData().labelRects, {id: activeLabelId});
    }

    public static getActivePointLabel(): LabelPoint | null {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(LabelsSelector.getActiveImageData().labelPoints, {id: activeLabelId});
    }

    public static getActivePolygonLabel(): LabelPolygon | null {
        const activeLabelId: string | null = LabelsSelector.getActiveLabelId();

        if (activeLabelId === null)
            return null;

        return _.find(LabelsSelector.getActiveImageData().labelPolygons, {id: activeLabelId});
    }
}