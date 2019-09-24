import {IRect} from "../../interfaces/IRect";
import {Action} from "../Actions";
import {LabelType} from "../../data/enums/LabelType";
import {IPoint} from "../../interfaces/IPoint";
import {LabelStatus} from "../../data/enums/LabelStatus";

export type LabelRect = {
    id: string;
    // todo: to be removed
    labelIndex: number;
    labelId: string;
    rect: IRect;
    isCreatedByAI: boolean;
    status: LabelStatus;
}

export type LabelPoint = {
    id: string;
    // todo: to be removed
    labelIndex: number;
    labelId: string;
    point: IPoint;
}

export type LabelPolygon = {
    id: string;
    // todo: to be removed
    labelIndex: number;
    labelId: string;
    vertices: IPoint[];
}

export type LabelName = {
    name: string;
    id: string;
}

export type ImageData = {
    id: string;
    fileData: File;
    loadStatus: boolean;
    labelRects: LabelRect[];
    labelPoints: LabelPoint[];
    labelPolygons: LabelPolygon[];
    isVisitedByObjectDetector: boolean;
}

export type LabelsState = {
    activeImageIndex: number;
    // todo: to be removed
    activeLabelNameIndex: number;
    activeLabelNameId: string;
    activeLabelType: LabelType;
    activeLabelId: string;
    highlightedLabelId: string;
    imagesData: ImageData[];
    // todo: to be removed
    labelNames: string[];
    firstLabelCreatedFlag: boolean;
    labels: LabelName[];
}

interface UpdateActiveImageIndex {
    type: typeof Action.UPDATE_ACTIVE_IMAGE_INDEX;
    payload: {
        activeImageIndex: number;
    }
}

// todo: to be removed
interface UpdateActiveLabelNameIndex {
    type: typeof Action.UPDATE_ACTIVE_LABEL_NAME_INDEX;
    payload: {
        activeLabelNameIndex: number;
    }
}

interface UpdateActiveLabelNameId {
    type: typeof Action.UPDATE_ACTIVE_LABEL_NAME_ID;
    payload: {
        activeLabelNameId: string;
    }
}

interface UpdateActiveLabelId {
    type: typeof Action.UPDATE_ACTIVE_LABEL_ID;
    payload: {
        activeLabelId: string;
    }
}

interface UpdateHighlightedLabelId {
    type: typeof Action.UPDATE_HIGHLIGHTED_LABEL_ID;
    payload: {
        highlightedLabelId: string;
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
        imageData: ImageData[];
    }
}

interface UpdateImageData {
    type: typeof Action.UPDATE_IMAGES_DATA;
    payload: {
        imageData: ImageData[];
    }
}

// todo: to be removed
interface UpdateLabelNamesList {
    type: typeof Action.UPDATE_LABEL_NAMES_LIST;
    payload: {
        labelNames: string[];
    }
}

interface UpdateLabelNames {
    type: typeof Action.UPDATE_LABEL_NAMES;
    payload: {
        labels: LabelName[];
    }
}

interface UpdateFirstLabelCreatedFlag {
    type: typeof Action.UPDATE_FIRST_LABEL_CREATED_FLAG;
    payload: {
        firstLabelCreatedFlag: boolean;
    }
}

export type LabelsActionTypes = UpdateActiveImageIndex
    // todo: to be removed
    | UpdateActiveLabelNameIndex
    | UpdateActiveLabelNameId
    | UpdateActiveLabelType
    | UpdateImageDataById
    | AddImageData
    | UpdateImageData
    // todo: to be removed
    | UpdateLabelNamesList
    | UpdateLabelNames
    | UpdateActiveLabelId
    | UpdateHighlightedLabelId
    | UpdateFirstLabelCreatedFlag

