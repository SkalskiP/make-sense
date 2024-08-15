import {MagicWandActionTypes, MagicWandState} from './types';
import {Action} from '../Actions';

const initialState: MagicWandState = {
    magicWandActive: false,
    magicWandTolerance: 30,
    magicWandMask: undefined,
    magicWandRect: undefined,
};

export function magicWandReducer(
    state = initialState,
    action: MagicWandActionTypes
): MagicWandState {
    switch (action.type) {
        case Action.UPDATE_MAGIC_WAND_ACTIVE_STATUS: {
            return {
                ...state,
                magicWandActive: action.payload.magicWandActive
            }
        }
        case Action.UPDATE_MAGIC_WAND_TOLERANCE: {
            return {
                ...state,
                magicWandTolerance: action.payload.magicWandTolerance
            }
        }
        case Action.UPDATE_MAGIC_WAND_MASK: {
            return {
                ...state,
                magicWandMask: action.payload.magicWandMask
            }
        }
        case Action.UPDATE_MAGIC_WAND_RECT: {
            return {
                ...state,
                magicWandRect: action.payload.magicWandRect
            }
        }
        default:
            return state;
    }
}
