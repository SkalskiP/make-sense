import {IPoint} from "../../interfaces/IPoint";
import {DrawUtil} from "../../utils/DrawUtil";
import {Settings} from "../../settings/Settings";
import {IRect} from "../../interfaces/IRect";
import {BaseRenderEngine} from "./BaseRenderEngine";
import React from "react";
import {RectUtil} from "../../utils/RectUtil";

export class PrimaryEditorRenderEngine extends BaseRenderEngine {
    private readonly canvas: HTMLCanvasElement;
    private crossHairColor: string = Settings.CROSS_HAIR_COLOR;
    private crossHairThickness: number = Settings.CROSS_HAIR_THICKNESS_PX;
    private imageRect: IRect;
    private mousePosition: IPoint;

    public constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
    }

    public mouseMoveHandler(event: MouseEvent): void {
        this.mousePosition = this.getMousePositionOnCanvasFromEvent(event);
    }

    public mouseDownHandler(event: MouseEvent): void {
        this.mousePosition = this.getMousePositionOnCanvasFromEvent(event);
    }

    public mouseUpHandler(event: MouseEvent): void {
        this.mousePosition = this.getMousePositionOnCanvasFromEvent(event);
    }

    public render(): void {
        this.drawCrossHair();
    }

    public updateImageRect(imageRect: IRect): void {
        this.imageRect = imageRect;
    }

    public drawImage(image: HTMLImageElement) {
        if (!!image && !!this.canvas) {
            const ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, this.imageRect.x, this.imageRect.y, this.imageRect.width, this.imageRect.height);
        }
    }

    public drawCrossHair(): void {
        if (!this.mousePosition || !this.canvas)
            return;

        const canvasRect: IRect = {x: 0, y: 0, width: this.canvas.width, height: this.canvas.height};

        if (!RectUtil.isPointInside(canvasRect, this.mousePosition))
            return;

        const horizontalLineStart: IPoint = DrawUtil.setPointBetweenPixels({x: 0, y: this.mousePosition.y});
        const horizontalLineEnd: IPoint = DrawUtil.setPointBetweenPixels({x: this.canvas.width, y: this.mousePosition.y});
        DrawUtil.drawLine(this.canvas, horizontalLineStart, horizontalLineEnd, this.crossHairColor, this.crossHairThickness);

        const verticalLineStart: IPoint = DrawUtil.setPointBetweenPixels({x: this.mousePosition.x, y: 0});
        const verticalLineEnd: IPoint = DrawUtil.setPointBetweenPixels({x: this.mousePosition.x, y: this.canvas.height});
        DrawUtil.drawLine(this.canvas, verticalLineStart, verticalLineEnd, this.crossHairColor, this.crossHairThickness)

    }

    private getMousePositionOnCanvasFromEvent(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent): IPoint {
        if (!!this.canvas) {
            const canvasRect: ClientRect | DOMRect = this.canvas.getBoundingClientRect();
            return {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            }
        }
        else {
            return null;
        }
    }
}