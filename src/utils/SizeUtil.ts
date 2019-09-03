import {ISize} from "../interfaces/ISize";

export class SizeUtil {
    public static eq(s1: ISize, s2: ISize): boolean {
        if (!s1 || !s2) return false;
        else {
            return s1.height === s2.height && s1.width === s2.width;
        }
    }
}