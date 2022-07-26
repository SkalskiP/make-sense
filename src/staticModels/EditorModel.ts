import { PrimaryEditorRenderEngine } from "../logic/render/PrimaryEditorRenderEngine";
import { BaseRenderEngine } from "../logic/render/BaseRenderEngine";
import { IRect } from "../interfaces/IRect";
import { IPoint } from "../interfaces/IPoint";
import { ISize } from "../interfaces/ISize";
import Scrollbars from "react-custom-scrollbars-2";
import { ViewPortHelper } from "../logic/helpers/ViewPortHelper";

export class EditorModel {
    public static editor: HTMLDivElement;
    public static canvas: HTMLCanvasElement;
    public static mousePositionIndicator: HTMLDivElement;
    public static cursor: HTMLDivElement;
    public static viewPortScrollbars: Scrollbars;
    public static image: HTMLImageElement;

    public static primaryRenderingEngine: PrimaryEditorRenderEngine;
    public static supportRenderingEngine: BaseRenderEngine;

    public static viewPortHelper: ViewPortHelper;

    public static isLoading: boolean = false;
    public static viewPortActionsDisabled: boolean = false;
    public static mousePositionOnViewPortContent: IPoint;
    public static viewPortSize: ISize;

    // x and y describe the dimension of the margin that remains constant regardless of the scale of the image
    // width and height describes the render image size for 100% scale
    public static defaultRenderImageRect: IRect;
}