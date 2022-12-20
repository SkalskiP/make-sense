import {updateWindowSize} from '../../store/general/actionCreators';
import {ContextManager} from '../context/ContextManager';
import {store} from '../../index';
import {PlatformUtil} from '../../utils/PlatformUtil';
import {PlatformModel} from '../../staticModels/PlatformModel';
import {EventType} from '../../data/enums/EventType';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {EnvironmentUtil} from '../../utils/EnvironmentUtil';

export class AppInitializer {
    public static inti():void {
        AppInitializer.handleResize();
        AppInitializer.detectDeviceParams();
        AppInitializer.handleAccidentalPageExit();
        window.addEventListener(EventType.RESIZE, AppInitializer.handleResize);
        window.addEventListener(EventType.MOUSE_WHEEL, AppInitializer.disableGenericScrollZoom,{passive:false});
        window.addEventListener(EventType.KEY_DOWN, AppInitializer.disableUnwantedKeyBoardBehaviour);
        window.addEventListener(EventType.KEY_PRESS, AppInitializer.disableUnwantedKeyBoardBehaviour);
        ContextManager.init();
    }

    private static handleAccidentalPageExit = () => {
        window.onbeforeunload = (event) => {
            const projectType = GeneralSelector.getProjectType();
            if (projectType != null && EnvironmentUtil.isProd()) {
                event.preventDefault();
                event.returnValue = '';
            }
        }
    };

    private static handleResize = () => {
        store.dispatch(updateWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        }));
    };

    private static disableUnwantedKeyBoardBehaviour = (event: KeyboardEvent) => {
        if (['=', '+', '-'].includes(event.key)) {
            if (event.ctrlKey || (PlatformModel.isMac && event.metaKey)) {
                event.preventDefault();
            }
        }
    };

    private static disableGenericScrollZoom = (event: MouseEvent) => {
        if (event.ctrlKey || (PlatformModel.isMac && event.metaKey)) {
            event.preventDefault();
        }
    };

    private static detectDeviceParams = () => {
        const userAgent: string = window.navigator.userAgent;
        PlatformModel.mobileDeviceData = PlatformUtil.getMobileDeviceData(userAgent);
        PlatformModel.isMac = PlatformUtil.isMac(userAgent);
        PlatformModel.isSafari = PlatformUtil.isSafari(userAgent);
        PlatformModel.isFirefox = PlatformUtil.isFirefox(userAgent);
    };
}