import {IPoint} from "../interfaces/IPoint";
import {DrawUtil} from "../utils/DrawUtil";
import {Settings} from "../settings/Settings";
import {IRect} from "../interfaces/IRect";

export class EditorCanvasRenderHelper {
    private crossHairColor: string = Settings.CROSS_HAIR_COLOR;
    private crossHairThickness: number = Settings.CROSS_HAIR_THICKNESS;
    private canvas: HTMLCanvasElement;
    private imageRect: IRect;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public getImageRect(): IRect {
        return this.imageRect;
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

    public drawCrossHair(mousePosition: IPoint): void {
        if (!!mousePosition && !!this.canvas) {
            const horizontalLineStart: IPoint = DrawUtil.setPointBetweenPixels({x: 0, y: mousePosition.y});
            const horizontalLineEnd: IPoint = DrawUtil.setPointBetweenPixels({x: this.canvas.width, y: mousePosition.y});
            DrawUtil.drawLine(this.canvas, horizontalLineStart, horizontalLineEnd, this.crossHairColor, this.crossHairThickness);

            const verticalLineStart: IPoint = DrawUtil.setPointBetweenPixels({x: mousePosition.x, y: 0});
            const verticalLineEnd: IPoint = DrawUtil.setPointBetweenPixels({x: mousePosition.x, y: this.canvas.height});
            DrawUtil.drawLine(this.canvas, verticalLineStart, verticalLineEnd, this.crossHairColor, this.crossHairThickness)
        }
    }
}