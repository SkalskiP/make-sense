import {LabelsActionTypes, ImageData} from "./types";
import {Action} from "../Actions";
import {LabelType} from "../../data/enums/LabelType";

export function updateActiveImageIndex(activeImageIndex: number): LabelsActionTypes {
    return {
        type: Action.UPDATE_ACTIVE_IMAGE_INDEX,
        payload: {
            activeImageIndex,
        },
    };
}

export function updateActiveLabelNameIndex(activeLabelNameIndex: number): LabelsActionTypes {
    return {
        type: Action.UPDATE_ACTIVE_LABEL_NAME_INDEX,
        payload: {
            activeLabelNameIndex,
        },
    };
}

export function updateActiveLabelId(activeLabelId: string): LabelsActionTypes {
    return {
        type: Action.UPDATE_ACTIVE_LABEL_ID,
        payload: {
            activeLabelId,
        },
    };
}

export function updateHighlightedLabelId(highlightedLabelId: string): LabelsActionTypes {
    return {
        type: Action.UPDATE_HIGHLIGHTED_LABEL_ID,
        payload: {
            highlightedLabelId,
        },
    };
}

export function updateActiveLabelType(activeLabelType: LabelType): LabelsActionTypes {
    return {
        type: Action.UPDATE_ACTIVE_LABEL_TYPE,
        payload: {
            activeLabelType,
        },
    };
}

export function updateImageDataById(id: string, newImageData: ImageData): LabelsActionTypes {
    return {
        type: Action.UPDATE_IMAGE_DATA_BY_ID,
        payload: {
            id,
            newImageData
        },
    };
}

export function addImageData(imageData: ImageData[]): LabelsActionTypes {
    return {
        type: Action.ADD_IMAGES_DATA,
        payload: {
            imageData,
        },
    };
}

export function updateImageData(imageData: ImageData[]): LabelsActionTypes {
    return {
        type: Action.UPDATE_IMAGES_DATA,
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

export function updateFirstLabelCreatedFlag(firstLabelCreatedFlag: boolean) {
    return {
        type: Action.UPDATE_FIRST_LABEL_CREATED_FLAG,
        payload: {
            firstLabelCreatedFlag
        }
    }
}