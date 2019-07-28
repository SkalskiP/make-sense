export type ImageMap = { [s: string]: HTMLImageElement; };

export class ImageRepository {
    private static repository: ImageMap = {};

    public static store(uuid: string, image: HTMLImageElement): string {
        ImageRepository.repository[uuid] = image;
        return uuid;
    }

    public static getById(uuid: string): HTMLImageElement {
        return ImageRepository.repository[uuid];
    }
}