
import {IPoint} from '../interfaces/IPoint';
import {IRect} from '../interfaces/IRect';
import {UnitUtil} from './UnitUtil';

export class DrawUtil {

    public static clearCanvas(canvas:HTMLCanvasElement): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    public static drawLine(canvas:HTMLCanvasElement, startPoint:IPoint, endPoint:IPoint, color = '#111111', thickness = 1): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x + 1, endPoint.y + 1);
        ctx.stroke();
        ctx.restore();
    }

    public static drawRect(canvas:HTMLCanvasElement, rect:IRect, color = '#fff', thickness = 1): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.stroke();
        ctx.restore();
    }

    public static drawRectWithFill(canvas:HTMLCanvasElement, rect:IRect, color = '#fff'): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.width, rect.height);
        ctx.fill();
        ctx.restore();
    }

    public static shadeEverythingButRect(canvas:HTMLCanvasElement, rect:IRect, color = 'rgba(0, 0, 0, 0.7)'): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.restore();
    }

    public static drawCircleWithFill(canvas:HTMLCanvasElement, anchorPoint:IPoint, radius:number, color = '#ffffff'):void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        const startAngleRad = UnitUtil.deg2rad(0);
        const endAngleRad = UnitUtil.deg2rad(360);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(anchorPoint.x, anchorPoint.y, radius, startAngleRad, endAngleRad, false);
        ctx.fill();
        ctx.restore();
    }

    public static drawCircle(canvas:HTMLCanvasElement, anchorPoint:IPoint, radius:number, startAngleDeg:number, endAngleDeg:number, thickness = 20, color = '#ffffff'): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        const startAngleRad = UnitUtil.deg2rad(startAngleDeg);
        const endAngleRad = UnitUtil.deg2rad(endAngleDeg);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.arc(anchorPoint.x, anchorPoint.y, radius, startAngleRad, endAngleRad, false);
        ctx.stroke();
        ctx.restore();
    }

    public static drawPolygon(canvas:HTMLCanvasElement, anchors: IPoint[], color = '#fff', thickness = 1): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(anchors[0].x, anchors[0].y);
        for (let i = 1; i < anchors.length; i ++) {
            ctx.lineTo(anchors[i].x, anchors[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    public static drawPolygonWithFill(canvas:HTMLCanvasElement, anchors: IPoint[], color = '#fff'): void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(anchors[0].x, anchors[0].y);
        for (let i = 1; i < anchors.length; i ++) {
            ctx.lineTo(anchors[i].x, anchors[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    public static drawText(canvas:HTMLCanvasElement, text:string, textSize:number, anchorPoint:IPoint, color = '#ffffff', bold = false, align = 'center'):void {
        const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = color;
        ctx.textAlign = align as CanvasTextAlign;
        ctx.textBaseline='middle';
        ctx.font = (bold ? 'bold ' : '') + textSize + 'px Arial';
        ctx.fillText(text, anchorPoint.x, anchorPoint.y);
        ctx.restore();
    }

    public static hexToRGB(hex: string, alpha: number | null = null): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        if (alpha !== null) {
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
            return `rgb(${r}, ${g}, ${b})`;
        }
    }
}
