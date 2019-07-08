import {IRect} from "../../interfaces/IRect";
import {ProjectType} from "../../data/ProjectType";
import {Action} from "../Actions";
import {LabelType} from "../../data/LabelType";

export type LabelRect = {
    id: string;
    labelIndex: number;
    rect: IRect;
}

export type ImageData = {
    id: string;
    fileData: File;
    loadStatus: boolean;
    labels: LabelRect[];
}

export type EditorState = {
    activeImageIndex: number;
    activeLabelIndex: number;
    activeLabelType: LabelType;
    projectType: ProjectType;
    imagesData: ImageData[];
    labelNames: string[];
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

interface UpdateActiveLabelIndex {
    type: typeof Action.UPDATE_ACTIVE_LABEL_INDEX;
    payload: {
        activeLabelIndex: number;
    }
}

interface UpdateActiveLabelType {
    type: typeof Action.UPDATE_ACTIVE_LABEL_TYPE;
    payload: {
        activeLabelType: LabelType;
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

interface UpdateLabelNamesList {
    type: typeof Action.UPDATE_LABEL_NAMES_LIST;
    payload: {
        labelNames: string[]
    }
}

export type EditorActionTypes = UpdateProjectType
    | UpdateActiveImageIndex
    | UpdateActiveLabelIndex
    | UpdateActiveLabelType
    | UpdateImageDataById
    | AddImageData
    | UpdateLabelNamesList

