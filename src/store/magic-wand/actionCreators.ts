import {MagicWandActionTypes} from './types';
import {Action} from '../Actions';
import {Matrix,Rectangle} from '../../utils/MagicWandUtil';

export function updateMagicWandActiveStatus(magicWandActive: boolean): MagicWandActionTypes {
    return {
        type: Action.UPDATE_MAGIC_WAND_ACTIVE_STATUS,
        payload: {
            magicWandActive,
        },
    };
}

export function updateMagicWandTolerance(magicWandTolerance: number): MagicWandActionTypes {
    return {
        type: Action.UPDATE_MAGIC_WAND_TOLERANCE,
        payload: {
            magicWandTolerance,
        },
    };
}

export function updateMagicWandMask(magicWandMask: Matrix): MagicWandActionTypes {
    return {
        type: Action.UPDATE_MAGIC_WAND_MASK,
        payload: {
            magicWandMask,
        },
    };
}

export function updateMagicWandRect(magicWandRect: Rectangle): MagicWandActionTypes {
    return {
        type: Action.UPDATE_MAGIC_WAND_RECT,
        payload: {
            magicWandRect,
        },
    };
}
