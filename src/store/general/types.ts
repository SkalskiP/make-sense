import {ISize} from "../../interfaces/ISize";
import {Action} from "../Actions";

export type GeneralState = {
    windowSize: ISize;
}

interface UpdateWindowSize {
    type: typeof Action.UPDATE_WINDOW_SIZE;
    payload: {
        windowSize: ISize;
    }
}

export type GeneralActionTypes = UpdateWindowSize