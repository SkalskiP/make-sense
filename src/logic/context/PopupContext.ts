import {HotKeyAction} from '../../data/HotKeyAction';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {BaseContext} from './BaseContext';
import {PopupActions} from '../actions/PopupActions';
import {Settings} from '../../settings/Settings';

export class PopupContext extends BaseContext {
    public static actions: HotKeyAction[] = [
        {
            keyCombo: ['Escape'],
            action: (event: KeyboardEvent) => {
                const popupType: PopupWindowType = GeneralSelector.getActivePopupType();
                const canBeClosed: boolean = Settings.CLOSEABLE_POPUPS.includes(popupType);
                if (canBeClosed) {
                    PopupActions.close();
                }
            }
        }
    ];
}
