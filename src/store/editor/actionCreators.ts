import {ProjectType} from "../../data/ProjectType";
import {EditorActionTypes, ImageData} from "./types";
import {Action} from "../Actions";

export function updateProjectType(projectType: ProjectType): EditorActionTypes {
    return {
        type: Action.UPDATE_PROJECT_TYPE,
        payload: {
            projectType,
        },
    };
}

export function updateActiveImageIndex(activeImageIndex: number): EditorActionTypes {
    return {
        type: Action.UPDATE_ACTIVE_IMAGE_INDEX,
        payload: {
            activeImageIndex,
        },
    };
}

export function updateActiveLabelIndex(activeLabelIndex: number): EditorActionTypes {
    return {
        type: Action.UPDATE_ACTIVE_LABEL_INDEX,
        payload: {
            activeLabelIndex,
        },
    };
}

export function updateImageDataById(id: string, newImageData: ImageData): EditorActionTypes {
    return {
        type: Action.UPDATE_IMAGE_DATA_BY_ID,
        payload: {
            id,
            newImageData
        },
    };
}

export function addImageData(imageData: ImageData[]): EditorActionTypes {
    return {
        type: Action.ADD_IMAGES_DATA,
        payload: {
            imageData,
        },
    };
}

export function updateLabelNamesList(labelNames: string[]) {
    return {
        type: Action.UPDATE_LABEL_NAMES_LIST,
        payload: {
            labelNames
        }
    }
}