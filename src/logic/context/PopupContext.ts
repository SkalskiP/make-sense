import {HotKeyAction} from "../../data/HotKeyAction";
import {PopupWindowType} from "../../data/enums/PopupWindowType";
import {GeneralSelector} from "../../store/selectors/GeneralSelector";
import {store} from "../../index";
import {updateActivePopupType} from "../../store/general/actionCreators";
import {ContextManager} from "./ContextManager";
import {BaseContext} from "./BaseContext";

export class PopupContext extends BaseContext {
    public static actions: HotKeyAction[] = [
        {
            keyCombo: ["Escape"],
            action: (event: KeyboardEvent) => {
                const popupType: PopupWindowType = GeneralSelector.getActivePopupType();
                if (popupType === PopupWindowType.LOAD_IMAGES || popupType === PopupWindowType.EXIT_PROJECT || popupType === PopupWindowType.EXPORT_LABELS) {
                    store.dispatch(updateActivePopupType(null));
                    ContextManager.restoreContext();
                }
            }
        }
    ];
}