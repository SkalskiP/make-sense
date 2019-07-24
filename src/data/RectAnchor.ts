import {RectAnchorType} from "./RectAnchorType";
import {IPoint} from "../interfaces/IPoint";

export interface RectAnchor {
    type: RectAnchorType,
    middlePosition: IPoint
}