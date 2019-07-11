import {IPoint} from "../interfaces/IPoint";
import React from "react";
import {IRect} from "../interfaces/IRect";
import {RectUtil} from "../utils/RectUtil";
import {Settings} from "../settings/Settings";
import {DrawUtil} from "../utils/DrawUtil";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {store} from "../index";
import {ImageData, LabelRect} from "../store/editor/types";
import uuidv1 from 'uuid/v1';
import {updateImageDataById} from "../store/editor/actionCreators";

export class RectSecondaryRenderEngine extends BaseRenderEngine {
    private canvas: HTMLCanvasElement;
    private labelingInProgress: boolean = false;
    private boundingBoxColor: string = Settings.SECONDARY_COLOR;
    private boundingBoxInactiveColor: string = Settings.BOUNDING_BOX_INACTIVE_COLOR;
    private boundingBoxThickness: number = Settings.BOUNDING_BOX_THICKNESS;
    private mousePosition: IPoint;
    private imageRect: IRect;
    private startPoint: IPoint;

    public constructor(canvas: HTMLCanvasElement, imageRect: IRect) {
        super();
        this.canvas = canvas;
        this.imageRect = imageRect;
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        window.addEventListener("mouseup", this.mouseUpHandler);
    }

    public render() {
        if (this.labelingInProgress) {
            const activeRect: IRect = {
                x: this.startPoint.x,
                y: this.startPoint.y,
                width: this.mousePosition.x - this.startPoint.x,
                height: this.mousePosition.y - this.startPoint.y
            };
            const activeRectBetweenPixels = DrawUtil.setRectBetweenPixels(activeRect);
            DrawUtil.drawRect(this.canvas, activeRectBetweenPixels, this.boundingBoxColor, this.boundingBoxThickness);
        }

        const activeImageIndex = store.getState().editor.activeImageIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];

        if (imageData) {
            imageData.labelRects.forEach((labelRect: LabelRect) => {
                const rectBetweenPixels = DrawUtil.setRectBetweenPixels(labelRect.rect);
                DrawUtil.drawRect(this.canvas, rectBetweenPixels, this.boundingBoxInactiveColor, this.boundingBoxThickness);
            })
        }
    }

    public updateImageRect(imageRect: IRect): void {
        this.imageRect = imageRect;
    }

    public unmount() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        window.removeEventListener("mouseup", this.mouseUpHandler);
    }

    private mouseDownHandler = (event: any) => {
        const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
        const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);

        if (isOverImage) {
            this.startPoint = mousePosition;
            this.mousePosition = mousePosition;
            this.labelingInProgress = true;
        }
    };

    private mouseUpHandler = (event: any) => {
        const mousePosition: IPoint = this.getMousePositionOnCanvasFromEvent(event);
        const isOverImage: boolean = RectUtil.isPointInside(this.imageRect, mousePosition);

        if (isOverImage && this.labelingInProgress) {
            const minX: number = Math.min(this.startPoint.x, this.mousePosition.x);
            const minY: number = Math.min(this.startPoint.y, this.mousePosition.y);
            const maxX: number = Math.max(this.startPoint.x, this.mousePosition.x);
            const maxY: number = Math.max(this.startPoint.y, this.mousePosition.y);

            const rect: IRect = {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
            this.addRectLabel(rect);
        }

        this.startPoint = null;
        this.mousePosition = null;
        this.labelingInProgress = false;
    };

    public mouseMoveHandler = (event: MouseEvent) => {
        this.mousePosition = this.getMousePositionOnCanvasFromEvent(event);
    };

    public addRectLabel = (rect: IRect) => {
        const activeImageIndex = store.getState().editor.activeImageIndex;
        const activeLabelIndex = store.getState().editor.activeLabelIndex;
        const imageData: ImageData = store.getState().editor.imagesData[activeImageIndex];
        const labelRect: LabelRect = {
            id: uuidv1(),
            labelIndex: activeLabelIndex,
            rect: rect
        };
        imageData.labelRects.push(labelRect);
        store.dispatch(updateImageDataById(imageData.id, imageData));
    };

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