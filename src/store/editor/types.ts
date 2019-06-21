import {IRect} from "../../interfaces/IRect";
import {ProjectType} from "../../data/ProjectType";
import {Action} from "../Actions";

export type LabelRect = {
    index: number;
    rect: IRect;
}

export type ImageData = {
    fileData: File;
    width: number;
    height: number;
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

interface UpdateImageDataByIndex {
    type: typeof Action.UPDATE_IMAGE_DATA_BY_INDEX;
    payload: {
        imageIndex: number;
        imageData: ImageData;
    }
}

export type EditorActionTypes = UpdateProjectType
    | UpdateActiveImageIndex
    | UpdateImageDataByIndex

