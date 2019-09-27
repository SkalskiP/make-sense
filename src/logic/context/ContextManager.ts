import {ContextType} from "../../data/enums/ContextType";
import {HotKeyAction} from "../../data/HotKeyAction";
import {store} from "../../index";
import {updateActiveContext} from "../../store/general/actionCreators";
import {xor, isEmpty} from "lodash";
import {EditorContext} from "./EditorContext";
import {PopupContext} from "./PopupContext";
import {GeneralSelector} from "../../store/selectors/GeneralSelector";
import {EventType} from "../../data/enums/EventType";

export class ContextManager {
    private static activeCombo: string[] = [];
    private static actions: HotKeyAction[] = [];
    private static contextHistory: ContextType[] = [];

    public static getActiveCombo(): string[] {
        return ContextManager.activeCombo;
    }

    public static init(): void {
        window.addEventListener(EventType.KEY_DOWN, ContextManager.onDown);
        window.addEventListener(EventType.KEY_UP, ContextManager.onUp);
        window.addEventListener(EventType.FOCUS, ContextManager.onFocus);
    }

    public static switchCtx(context: ContextType): void {
        const activeCtx: ContextType = GeneralSelector.getActiveContext();

        if (activeCtx !== context) {
            ContextManager.contextHistory.push(activeCtx);
            ContextManager.updateCtx(context);
        }
    }

    private static updateCtx(context: ContextType): void {
        store.dispatch(updateActiveContext(context));
        switch (context) {
            case ContextType.EDITOR:
                ContextManager.actions = EditorContext.getActions();
                break;
            case ContextType.POPUP:
                ContextManager.actions = PopupContext.getActions();
                break;
            default:
                ContextManager.actions = [];
        }
    }

    public static restoreCtx(): void {
        ContextManager.updateCtx(ContextManager.contextHistory.pop());
    }

    private static onDown(event: KeyboardEvent): void {
        const keyCode: string = ContextManager.getKeyCodeFromEvent(event);
        if (!ContextManager.isInCombo(keyCode)) {
            ContextManager.addToCombo(keyCode);
        }
        ContextManager.execute(event);
    }

    private static onUp(event: KeyboardEvent): void {
        const keyCode: string = ContextManager.getKeyCodeFromEvent(event);
        ContextManager.removeFromCombo(keyCode);
    }

    public static onFocus() {
        ContextManager.activeCombo = [];
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
        return isEmpty(xor(combo1, combo2))
    }
}