import {HotKeyAction} from "../../data/HotKeyAction";
import {PopupWindowType} from "../../data/enums/PopupWindowType";
import {GeneralSelector} from "../../store/selectors/GeneralSelector";
import {BaseContext} from "./BaseContext";
import {PopupActions} from "../actions/PopupActions";

export class PopupContext extends BaseContext {
    public static actions: HotKeyAction[] = [
        {
            keyCombo: ["Escape"],
            action: (event: KeyboardEvent) => {
                const popupType: PopupWindowType = GeneralSelector.getActivePopupType();
                if (popupType === PopupWindowType.LOAD_IMAGES ||
                    popupType === PopupWindowType.EXIT_PROJECT ||
                    popupType === PopupWindowType.EXPORT_LABELS) {
                    PopupActions.close();
                }
            }
        }
    ];
}