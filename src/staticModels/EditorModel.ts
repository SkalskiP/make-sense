import {PrimaryEditorRenderEngine} from "../logic/render/PrimaryEditorRenderEngine";
import {BaseRenderEngine} from "../logic/render/BaseRenderEngine";
import {IRect} from "../interfaces/IRect";
import {IPoint} from "../interfaces/IPoint";
import {ISize} from "../interfaces/ISize";

export class EditorModel {
    public static editor: HTMLDivElement;
    public static canvas: HTMLCanvasElement;
    public static mousePositionIndicator: HTMLDivElement;
    public static cursor: HTMLDivElement;
    public static primaryRenderingEngine: PrimaryEditorRenderEngine;
    public static supportRenderingEngine: BaseRenderEngine;
    public static image: HTMLImageElement;
    public static isLoading: boolean = false;

    // =================================================================================================================
    // OLD MODEL
    // =================================================================================================================

    public static imageRectOnCanvas: IRect;
    public static imageScale: number; // Image / Canvas
    public static mousePositionOnCanvas: IPoint;

    // =================================================================================================================
    // NEW MODEL
    // =================================================================================================================

    public static zoomPercentage: number = 100;
    public static viewPortSize: ISize;

    // x and y describe the dimension of the margin that remains constant regardless of the scale of the image
    // width and height describes the render image size for 100% scale
    public static defaultRenderImageRect: ISize;
    public static scrollPosition: IPoint = {x: 0.5, y: 0.5};
}