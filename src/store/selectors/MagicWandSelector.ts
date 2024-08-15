import {store} from '../..';

export class MagicWandSelector {
    public static getMagicWandActiveStatus(): boolean {
        return store.getState().magicWand.magicWandActive;
    }

    public static getMagicWandTolerance(): number{
        return store.getState().magicWand.magicWandTolerance;
    }

    public static getMagicWandMask(): any{
        return store.getState().magicWand.magicWandMask;
    }

    public static getMagicWandRect(): any{
        return store.getState().magicWand.magicWandRect;
    }
}
