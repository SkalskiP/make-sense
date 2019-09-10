import {ISize} from "../interfaces/ISize";

export class SizeUtil {
    public static scale(size: ISize, scale: number): ISize {
        return {
            width: size.width * scale,
            height: size.height * scale
        }
    }
}