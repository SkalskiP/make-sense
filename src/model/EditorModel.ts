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
    public static viewPortRectOnCanvas: IRect;
    public static viewPortRectOnRenderImage: IRect;
    public static realImageToViewPortScale: number;
    public static realImageToRenderImageScale: number;
    public static mousePositionOnCanvas: IPoint;
    public static isLoading: boolean = false;
}