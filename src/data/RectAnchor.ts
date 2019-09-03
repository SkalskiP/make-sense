import {IPoint} from "../interfaces/IPoint";
import {Direction} from "./Direction";

export interface RectAnchor {
    type: Direction,
    position: IPoint
}