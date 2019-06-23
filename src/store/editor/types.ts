import {IRect} from "../../interfaces/IRect";
import {ProjectType} from "../../data/ProjectType";
import {Action} from "../Actions";

export type LabelRect = {
    id: string;
    labelIndex: number;
    rect: IRect;
}

export type ImageData = {
    id: string;
    fileData: File;
    labels: LabelRect[];
}

export type EditorState = {
    activeImageIndex: number;
    projectType: ProjectType;
    imagesData: ImageData[];
}

interface UpdateProjectType {
    type: typeof Action.UPDATE_PROJECT_TYPE;
    payload: {
        projectType: ProjectType;
    }
}

interface UpdateActiveImageIndex {
    type: typeof Action.UPDATE_ACTIVE_IMAGE_INDEX;
    payload: {
        activeImageIndex: number;
    }
}

interface UpdateImageDataById {
    type: typeof Action.UPDATE_IMAGE_DATA_BY_ID;
    payload: {
        id: string;
        newImageData: ImageData;
    }
}

interface AddImageData {
    type: typeof Action.ADD_IMAGES_DATA;
    payload: {
        imageData: ImageData[]
    }
}

export type EditorActionTypes = UpdateProjectType
    | UpdateActiveImageIndex
    | UpdateImageDataById
    | AddImageData

