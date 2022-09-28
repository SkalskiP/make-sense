import {ImageData} from '../store/labels/types';
import {v4 as uuidv4} from 'uuid';
import {FileUtil} from './FileUtil';
import {ImageRepository} from '../logic/imageRepository/ImageRepository';
import {APIImageData} from '../services/types';
import {MJImporter} from '../logic/import/MJ/MJImporter';

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
            isVisitedByObjectDetector: false,
            isVisitedByPoseDetector: false,
            humans: [],
            items: [],
            image_status: ""
        };
    }
    public static createImageDataFromAPIData(apiData: APIImageData): ImageData {
      
        const data: ImageData = {
            id: apiData.image_id,
            fileData: {
                //@ts-ignore
                path: apiData.image_url,
                width: parseInt(apiData.image_width),
                height: parseInt(apiData.image_height)
            },
            loadStatus: false,
            labelRects: [],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: [],
            isVisitedByObjectDetector: false,
            isVisitedByPoseDetector: false,
            humans: [],
            items: [],
            guideStyles: apiData.style_list,
            image_status: apiData.image_status  || ""
        };

        // if labeling_json data is available, apply annotations
        return apiData.labeling_json
            ? MJImporter.applyAnnotations(data, apiData.labeling_json, [])
            : data;
    }

    public static cleanAnnotations(item: ImageData): ImageData {
        return {
            ...item,
            labelRects: [],
            labelPoints: [],
            labelLines: [],
            labelPolygons: [],
            labelNameIds: [],
            humans: [],
            items: []
        };
    }

    public static arrange(
        items: ImageData[],
        idArrangement: string[]
    ): ImageData[] {
        return items.sort((a: ImageData, b: ImageData) => {
            return idArrangement.indexOf(a.id) - idArrangement.indexOf(b.id);
        });
    }

    public static loadMissingImages(images: ImageData[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const missingImages = images.filter(
                (i: ImageData) => !i.loadStatus
            );
            const missingImagesFiles = missingImages.map(
                (i: ImageData) => i.fileData
            );
            FileUtil.loadImages(missingImagesFiles)
                .then((htmlImageElements: HTMLImageElement[]) => {
                    ImageRepository.storeImages(
                        missingImages.map((i: ImageData) => i.id),
                        htmlImageElements
                    );
                    resolve();
                })
                .catch((error: Error) => reject(error));
        });
    }
}
