import {IPoint} from "../interfaces/IPoint";
import React from "react";
import {IRect} from "../interfaces/IRect";
import {RectUtil} from "../utils/RectUtil";
import {Settings} from "../settings/Settings";
import {DrawUtil} from "../utils/DrawUtil";

export class RectRenderHelper {
    private canvas: HTMLCanvasElement;
    private labelingInProgress: boolean = false;
    private boundingBoxColor: string = Settings.SECONDARY_COLOR;
    private boundingBoxThickness: number = Settings.BOUNDING_BOX_THICKNESS;
    private mousePosition: IPoint;
    private imageRect: IRect;
    private startPoint: IPoint;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        this.canvas = canvas;
        this.imageRect = imageRect;
        console.log("MOUNT RENDER HELPER");
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        window.addEventListener("mouseup", this.mouseUpHandler);
        window.addEventListener("mousemove", this.mouseMoveHandler);
    }

    public render() {
        if (!!this.startPoint && !!this.mousePosition) {
            console.log("render")
            const activeRect: IRect = {
                x: this.startPoint.x,
                y: this.startPoint.y,
                width: this.mousePosition.x - this.startPoint.x,
                height: this.mousePosition.y - this.startPoint.y
            };

            const activeRectBetweenPixels = DrawUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.boundingBoxColor, this.boundingBoxThickness);
        }
    }

    public updateImageRect(imageRect: IRect): void {
        this.imageRect = imageRect;
    }

    public unmount() {
        console.log("UNMOUNT RENDER HELPER");
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        window.removeEventListener("mouseup", this.mouseUpHandler);
        window.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    private mouseDownHandler = (event: any) => {
        const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
        const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);

        if (isOverImage) {
            this.startPoint = mousePosition;
            this.mousePosition = mousePosition;
            this.labelingInProgress = true;
            console.log("INSIDE");
        }
    };

    private mouseUpHandler = (event: any) => {
        this.startPoint = null;
        this.mousePosition = null;
        this.labelingInProgress = false;
    };

    private mouseMoveHandler = (event: any) => {
        const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);

        if (this.labelingInProgress) {
            this.mousePosition = mousePosition;
            console.log("MOUSE MOVE");
        }
    };

    private getMousePositionOnCanvasFromEvent(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): IPoint {
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