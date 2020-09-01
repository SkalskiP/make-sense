export type COCOSegmentation = number[][]
export type COCOBBox = [number, number, number, number]

export type COCOInfo = {
    description: string;
}

export type COCOImage = {
    id: number;
    width: number;
    height: number;
    file_name: string;
}

export type COCOCategory = {
    id: number;
    name: string;
}

export type COCOAnnotation = {
    id: number;
    category_id: number;
    iscrowd: number;
    segmentation: COCOSegmentation;
    image_id: number;
    area: number;
    bbox: COCOBBox;
}

export type COCOObject = {
    info: COCOInfo,
    images: COCOImage[],
    annotations: COCOAnnotation[],
    categories: COCOCategory[]
}