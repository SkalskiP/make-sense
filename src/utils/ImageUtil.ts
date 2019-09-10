import {ISize} from "../interfaces/ISize";

export class ImageUtil {
    public static getSize(image: HTMLImageElement): ISize {
        if (!image) return null;
        return {
            width: image.width,
            height: image.height
        }
    }
}