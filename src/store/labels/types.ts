import {IRect} from '../../interfaces/IRect';
import {Action} from '../Actions';
import {LabelType} from '../../data/enums/LabelType';
import {IPoint} from '../../interfaces/IPoint';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {ILine} from '../../interfaces/ILine';

export type Annotation = {
    id: string;
    labelId: string | null;
    isVisible: boolean;
}

export type LabelRect = Annotation & {
    rect: IRect;
    isCreatedByAI: boolean;
    status: LabelStatus;
    suggestedLabel: string;
}

export type LabelPoint = Annotation & {
    point: IPoint;
    isCreatedByAI: boolean;
    status: LabelStatus;
    suggestedLabel: string;
}

export type LabelPolygon = Annotation & {
    vertices: IPoint[];
}

export type LabelLine = Annotation & {
    line: ILine;
}

export type LabelName = {
    name: string;
    id: string;
    color?: string;
}

export type ImageData = {
    id: string;
    fileData: File;
    loadStatus: boolean;
    labelRects: LabelRect[];
    labelPoints: LabelPoint[];
    labelLines: LabelLine[];
    labelPolygons: LabelPolygon[];
    labelNameIds: string[];

    // YOLO
    isVisitedByYOLOObjectDetector: boolean;

    // SSD
    isVisitedBySSDObjectDetector: boolean;

    // POSE NET
    isVisitedByPoseDetector: boolean;

    // ROBOFLOW API
    isVisitedByRoboflowAPI: boolean;
}

export type LabelsState = {
    activeImageIndex: number;
    activeLabelNameId: string;
    activeLabelType: LabelType;
    activeLabelId: string | null;
    highlightedLabelId: string;
    imagesData: ImageData[];
    firstLabelCreatedFlag: boolean;
    labels: LabelName[];
}

interface UpdateActiveImageIndex {
    type: typeof Action.UPDATE_ACTIVE_IMAGE_INDEX;
    payload: {
        activeImageIndex: number;
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
    | UpdateActiveLabelNameId
    | UpdateActiveLabelType
    | UpdateImageDataById
    | AddImageData
    | UpdateImageData
    | UpdateLabelNames
    | UpdateActiveLabelId
    | UpdateHighlightedLabelId
    | UpdateFirstLabelCreatedFlag

