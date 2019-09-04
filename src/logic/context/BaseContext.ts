import {HotKeyAction} from "../../data/HotKeyAction";

export class BaseContext {
    public static actions: HotKeyAction[] = [];

    public static getActions(): HotKeyAction[] {
        return this.actions;
    }
}