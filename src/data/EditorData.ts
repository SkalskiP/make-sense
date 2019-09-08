import {IPoint} from "../interfaces/IPoint";
import {IRect} from "../interfaces/IRect";
import {ISize} from "../interfaces/ISize";

export interface EditorData {
    viewPortContentSize: ISize,
    mousePositionOnViewPortContent: IPoint,
    activeKeyCombo: string[],
    event?: Event

    // todo: The goal is to remove all fields of the old model from EditorData.

    // =================================================================================================================
    // OLD MODEL
    // =================================================================================================================

    activeImageScale: number,
    activeImageRectOnCanvas: IRect,

    // =================================================================================================================
    // NEW MODEL
    // =================================================================================================================

    zoom: number,
    viewPortSize: ISize,
    defaultRenderImageRect: IRect,
    realImageSize: ISize,
    viewPortContentImageRect: IRect
}