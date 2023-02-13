import { Action } from '../Actions';
import { AIActionTypes, RoboflowAPIDetails } from './types';

export function updateSuggestedLabelList(labelList: string[]): AIActionTypes {
    return {
        type: Action.UPDATE_SUGGESTED_LABEL_LIST,
        payload: {
            labelList,
        }
    }
}

export function updateRejectedSuggestedLabelList(labelList: string[]): AIActionTypes {
    return {
        type: Action.UPDATE_REJECTED_SUGGESTED_LABEL_LIST,
        payload: {
            labelList,
        }
    }
}

export function updateSSDObjectDetectorStatus(isSSDObjectDetectorLoaded: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_SSD_OBJECT_DETECTOR_STATUS,
        payload: {
            isSSDObjectDetectorLoaded,
        }
    }
}

export function updateYOLOV5ObjectDetectorStatus(isYOLOV5ObjectDetectorLoaded: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_YOLO_V5_OBJECT_DETECTOR_STATUS,
        payload: {
            isYOLOV5ObjectDetectorLoaded,
        }
    }
}

export function updatePoseDetectorStatus(isPoseDetectorLoaded: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_POSE_DETECTOR_STATUS,
        payload: {
            isPoseDetectorLoaded,
        }
    }
}

export function updateDisabledAIFlag(isAIDisabled: boolean): AIActionTypes {
    return {
        type: Action.UPDATE_DISABLED_AI_FLAG,
        payload: {
            isAIDisabled,
        }
    }
}

export function updateRoboflowAPIDetails(roboflowAPIDetails: RoboflowAPIDetails): AIActionTypes {
    return {
        type: Action.UPDATE_ROBOFLOW_API_DETAILS,
        payload: {
            roboflowAPIDetails
        }
    }
}
