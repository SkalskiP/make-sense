import {PrimaryEditorRenderEngine} from "../logic/render/PrimaryEditorRenderEngine";
import {BaseRenderEngine} from "../logic/render/BaseRenderEngine";
import {IRect} from "../interfaces/IRect";
import {IPoint} from "../interfaces/IPoint";

export class EditorModel {
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
}