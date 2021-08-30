import {IPoint} from '../interfaces/IPoint';
import {IRect} from '../interfaces/IRect';
import {ISize} from '../interfaces/ISize';

export interface EditorData {
    viewPortContentSize: ISize,
    mousePositionOnViewPortContent: IPoint,
    activeKeyCombo: string[],
    event?: Event
    zoom: number,
    viewPortSize: ISize,
    defaultRenderImageRect: IRect,
    realImageSize: ISize,
    viewPortContentImageRect: IRect,
    absoluteViewPortContentScrollPosition: IPoint
}
