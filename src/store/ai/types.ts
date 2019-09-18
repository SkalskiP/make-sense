import {Action} from "../Actions";

export type AIState = {
    isObjectDetectorLoaded: boolean;
}

interface UpdateObjectDetectorStatus {
    type: typeof Action.UPDATE_OBJECT_DETECTOR_STATUS;
    payload: {
        isObjectDetectorLoaded: boolean;
    }
}

export type AIActionTypes = UpdateObjectDetectorStatus