import {PrimaryEditorRenderEngine} from "../logic/render/PrimaryEditorRenderEngine";
import {BaseRenderEngine} from "../logic/render/BaseRenderEngine";
import {IRect} from "../interfaces/IRect";
import {IPoint} from "../interfaces/IPoint";
import {ISize} from "../interfaces/ISize";
import {ViewPointSettings} from "../settings/ViewPointSettings";
import Scrollbars from "react-custom-scrollbars";

export class EditorModel {
    public static editor: HTMLDivElement;
    public static canvas: HTMLCanvasElement;
    public static mousePositionIndicator: HTMLDivElement;
    public static cursor: HTMLDivElement;
    public static viewPortScrollbars: Scrollbars;
    public static primaryRenderingEngine: PrimaryEditorRenderEngine;
    public static supportRenderingEngine: BaseRenderEngine;
    public static image: HTMLImageElement;
    public static isLoading: boolean = false;

    // todo: The goal is to remove all fields of the old model from EditorModel.

    // =================================================================================================================
    // OLD MODEL
    // =================================================================================================================

    public static imageRectOnCanvas: IRect;
    public static imageScale: number; // Image / Canvas
    public static mousePositionOnCanvas: IPoint;

    // =================================================================================================================
    // NEW MODEL
    // =================================================================================================================

    public static zoom: number = ViewPointSettings.MIN_ZOOM;
    public static viewPortSize: ISize;

    // x and y describe the dimension of the margin that remains constant regardless of the scale of the image
    // width and height describes the render image size for 100% scale
    public static defaultRenderImageRect: IRect;
}