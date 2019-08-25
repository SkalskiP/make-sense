import React from "react";
import {IPoint} from "../interfaces/IPoint";
import {IRect} from "../interfaces/IRect";
import {ISize} from "../interfaces/ISize";

export class CanvasUtil {
    public static getMousePositionOnCanvasFromEvent(event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent, canvas: HTMLCanvasElement): IPoint {
        if (!!canvas && !!event) {
            const canvasRect: ClientRect | DOMRect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - canvasRect.left,
                y: event.clientY - canvasRect.top
            }
        }
        return null;
    }

    public static getClientRect(canvas: HTMLCanvasElement): IRect {
        if (!!canvas) {
            const canvasRect: ClientRect | DOMRect = canvas.getBoundingClientRect();
            return {
                x: canvasRect.left,
                y: canvasRect.top,
                width: canvasRect.width,
                height: canvasRect.height
            }
        }
        return null;
    }

    public static getSize(canvas: HTMLCanvasElement): ISize {
        if (!!canvas) {
            const canvasRect: ClientRect | DOMRect = canvas.getBoundingClientRect();
            return {
                width: canvasRect.width,
                height: canvasRect.height
            }
        }
        return null;
    }
}