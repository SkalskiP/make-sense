import {zip} from "lodash";

export type ImageMap = { [s: string]: HTMLImageElement; };

export class ImageRepository {
    private static repository: ImageMap = {};

    // Store image and metadata
    public static storeImage(id: string, image: HTMLImageElement) {
        ImageRepository.repository[id] = image;
    }

    // Remove image and metadata
    public static removeImage(id: string): void {
        if (id in ImageRepository.repository) {
            delete ImageRepository.repository[id];
        }
    }

    // Get image by ID
    public static getById(id: string): HTMLImageElement | null {
        if (id in ImageRepository.repository) {
            return ImageRepository.repository[id];
        } 
        return null;
    }

    // Batch operation: remove images
    public static removeImages(ids: string[]): void {
        ids.forEach(id => ImageRepository.removeImage(id));
    }

    // Batch operation: store images
    public static storeImages(ids: string[], images: HTMLImageElement[]) {
        zip(ids, images).forEach((item) => {
            const pair = item as [string, HTMLImageElement];
            ImageRepository.storeImage(...pair);
        });
    }
}