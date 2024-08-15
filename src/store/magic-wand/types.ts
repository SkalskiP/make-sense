import {Matrix,Rectangle} from '../../utils/MagicWandUtil';
import {Action} from '../Actions';

export type MagicWandState = {
    magicWandActive: boolean;
    magicWandTolerance: number;
    magicWandMask: Matrix;
    magicWandRect: Rectangle;
}

interface updateMagicWandActiveStatus {
    type: typeof Action.UPDATE_MAGIC_WAND_ACTIVE_STATUS;
    payload: {
        magicWandActive: boolean;
    }
}

interface updateMagicWandTolerance {
    type: typeof Action.UPDATE_MAGIC_WAND_TOLERANCE;
    payload: {
        magicWandTolerance: number;
    }
}

interface updateMagicWandMask {
    type: typeof Action.UPDATE_MAGIC_WAND_MASK;
    payload: {
        magicWandMask: Matrix;
    }
}

interface updateMagicWandRect {
    type: typeof Action.UPDATE_MAGIC_WAND_RECT;
    payload: {
        magicWandRect: Rectangle;
    }
}

export type MagicWandActionTypes = updateMagicWandActiveStatus
    | updateMagicWandTolerance
    | updateMagicWandMask
    | updateMagicWandRect;


