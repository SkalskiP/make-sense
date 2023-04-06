import {zip} from "lodash";

export type ImageMap = { [s: string]: HTMLImageElement; };
export type ImageMetadata = { rotation: number; flipped: boolean; };

export class ImageRepository {
    private static repository: ImageMap = {};
    private static metadata: ImageMetadata[] = [];

    // Store image and metadata
    public static storeImage(id: string, image: HTMLImageElement) {
        ImageRepository.repository[id] = image;
        ImageRepository.metadata[id] = {rotation: 0, flipped: false};
    }

    // Remove image and metadata
    public static removeImage(id: string): void {
        if (id in ImageRepository.metadata) {
            delete ImageRepository.repository[id];
            delete ImageRepository.metadata[id];
        }
    }

    // Get image by ID
    public static getById(id: string): HTMLImageElement | null {
        const image = ImageRepository.repository[id];
        if (image) {
            const {rotation, flipped} = ImageRepository.metadata[id];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            const width = image.width;
            const height = image.height;

            if (rotation % 180 === 0) {
                canvas.width = width;
                canvas.height = height;
            } else {
                canvas.width = height;
                canvas.height = width;
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(flipped ? -1 : 1, 1);
            ctx.drawImage(image, -width / 2, -height / 2, width, height);

            const rotatedImage = new Image();
            rotatedImage.src = canvas.toDataURL();
            return rotatedImage;
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