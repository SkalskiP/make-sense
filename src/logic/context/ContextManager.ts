import {Context} from "../../data/Context";
import {HotKeyAction} from "../../data/HotKeyAction";
import {store} from "../../index";
import {updateActiveContext} from "../../store/general/actionCreators";
import * as _ from "lodash";

export class ContextManager {
    private static activeCombo: string[] = [];
    private static actions: HotKeyAction[] = [];

    public static init(): void {
        window.addEventListener("keydown", ContextManager.onDown);
        window.addEventListener("keyup", ContextManager.onUp);
    }

    public static register(context: Context, actions: HotKeyAction[]): void {
        store.dispatch(updateActiveContext(context));
        ContextManager.actions = actions;
    }

    private static onDown(event: KeyboardEvent): void {
        const keyCode: string = ContextManager.getKeyCodeFromEvent(event);
        if (!ContextManager.isInCombo(keyCode)) {
            ContextManager.addToCombo(keyCode);
            ContextManager.execute(event);
        }
    }

    private static onUp(event: KeyboardEvent): void {
        const keyCode: string = ContextManager.getKeyCodeFromEvent(event);
        ContextManager.removeFromCombo(keyCode);
    }

    private static execute(event: KeyboardEvent): void {
        for (let i = 0; i < ContextManager.actions.length; i++) {
            const hotKey: HotKeyAction = ContextManager.actions[i];
            if (ContextManager.matchCombo(ContextManager.activeCombo, hotKey.keyCombo)) {
                hotKey.action(event);
            }
        }
    }

    private static isInCombo(keyCode: string): boolean {
        return ContextManager.activeCombo.indexOf(keyCode) >= 0;
    }

    private static addToCombo(keyCode: string): void {
        ContextManager.activeCombo.push(keyCode);
    }

    private static removeFromCombo(keyCode: string): void {
        const index: number = ContextManager.activeCombo.indexOf(keyCode);
        if (index >= 0) {
            ContextManager.activeCombo.splice(index, 1);
        }
    }

    private static getKeyCodeFromEvent(event: KeyboardEvent): string {
        return event.key;
    }

    private static matchCombo(combo1: string[], combo2: string[]): boolean {
        return _.isEmpty(_.xor(combo1, combo2))
    }
}