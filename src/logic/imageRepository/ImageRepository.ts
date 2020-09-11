import {zip} from "lodash";

export type ImageMap = { [s: string]: HTMLImageElement; };

export class ImageRepository {
    private static repository: ImageMap = {};

    public static storeImage(id: string, image: HTMLImageElement) {
        ImageRepository.repository[id] = image;
    }

    public static storeImages(ids: string[], images: HTMLImageElement[]) {
        zip(ids, images).forEach((pair: [string, HTMLImageElement]) => {
            ImageRepository.storeImage(...pair);
        })
    }

    public static getById(uuid: string): HTMLImageElement {
        return ImageRepository.repository[uuid];
    }
}