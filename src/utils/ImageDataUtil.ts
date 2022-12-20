import {ImageData} from '../store/labels/types';
import { v4 as uuidv4 } from 'uuid';
import {FileUtil} from './FileUtil';
import {ImageRepository} from '../logic/imageRepository/ImageRepository';

export class ImageDataUtil {
    public static createImageDataFromFileData(fileData: File): ImageData {
        return {
            id: uuidv4(),
            fileData,
            loadStatus: false,
            labelRects: [],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: [],
            isVisitedByYOLOObjectDetector: false,
            isVisitedBySSDObjectDetector: false,
            isVisitedByPoseDetector: false,
            isVisitedByRoboflowAPI: false
        }
    }

    public static cleanAnnotations(item: ImageData): ImageData {
        return {
            ...item,
            labelRects: [],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: []
        }
    }

    public static arrange(items: ImageData[], idArrangement: string[]): ImageData[] {
        return items.sort((a: ImageData, b: ImageData) => {
            return idArrangement.indexOf(a.id) - idArrangement.indexOf(b.id)
        })
    }

    public static loadMissingImages(images: ImageData[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const missingImages = images.filter((i: ImageData) => !i.loadStatus);
            const missingImagesFiles = missingImages.map((i: ImageData) => i.fileData);
            FileUtil.loadImages(missingImagesFiles)
                .then((htmlImageElements:HTMLImageElement[]) => {
                    ImageRepository.storeImages(missingImages.map((i: ImageData) => i.id), htmlImageElements);
                    resolve()
                })
                .catch((error: Error) => reject(error));
        });
    }
}
