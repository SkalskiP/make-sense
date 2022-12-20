import {Action} from '../Actions';

export type RoboflowAPIDetails = {
    status: boolean,
    model: string,
    key: string
}

export type AIState = {
    // SSD LOCAL
    isSSDObjectDetectorLoaded: boolean;

    // YOLO V5 LOCAL
    isYOLOV5ObjectDetectorLoaded: boolean;

    // POSE NET LOCAL
    isPoseDetectorLoaded: boolean;

    // ROBOFLOW API
    roboflowAPIDetails: RoboflowAPIDetails;

    // GENERAL
    suggestedLabelList: string[];
    rejectedSuggestedLabelList: string[];
    isAIDisabled: boolean;
}

interface UpdateSuggestedLabelList {
    type: typeof Action.UPDATE_SUGGESTED_LABEL_LIST;
    payload: {
        labelList: string[];
    }
}

interface UpdateRejectedSuggestedLabelList {
    type: typeof Action.UPDATE_REJECTED_SUGGESTED_LABEL_LIST;
    payload: {
        labelList: string[];
    }
}

interface UpdateSSDObjectDetectorStatus {
    type: typeof Action.UPDATE_SSD_OBJECT_DETECTOR_STATUS;
    payload: {
        isSSDObjectDetectorLoaded: boolean;
    }
}

interface UpdateYOLOV5ObjectDetectorStatus {
    type: typeof Action.UPDATE_YOLO_V5_OBJECT_DETECTOR_STATUS;
    payload: {
        isYOLOV5ObjectDetectorLoaded: boolean;
    }
}

interface UpdatePoseDetectorStatus {
    type: typeof Action.UPDATE_POSE_DETECTOR_STATUS;
    payload: {
        isPoseDetectorLoaded: boolean;
    }
}

interface UpdateDisabledAIFlag {
    type: typeof Action.UPDATE_DISABLED_AI_FLAG;
    payload: {
        isAIDisabled: boolean;
    }
}

interface UpdateRoboflowAPIDetails {
    type: typeof Action.UPDATE_ROBOFLOW_API_DETAILS;
    payload: {
        roboflowAPIDetails: RoboflowAPIDetails
    }
}

export type AIActionTypes = UpdateSuggestedLabelList
    | UpdateRejectedSuggestedLabelList
    | UpdateSSDObjectDetectorStatus
    | UpdateYOLOV5ObjectDetectorStatus
    | UpdatePoseDetectorStatus
    | UpdateDisabledAIFlag
    | UpdateRoboflowAPIDetails
