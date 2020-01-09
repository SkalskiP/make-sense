import {updateWindowSize} from "../../store/general/actionCreators";
import {ContextManager} from "../context/ContextManager";
import {store} from "../../index";
import {PlatformUtil} from "../../utils/PlatformUtil";
import {PlatformModel} from "../../staticModels/PlatformModel";
import {EventType} from "../../data/enums/EventType";
import ReactGA from 'react-ga';
import {Settings} from "../../settings/Settings";

export class AppInitializer {
    public static inti():void {
        AppInitializer.initGA();
        AppInitializer.handleResize();
        AppInitializer.detectDeviceParams();
        window.addEventListener(EventType.RESIZE, AppInitializer.handleResize);
        window.addEventListener(EventType.MOUSE_WHEEL, AppInitializer.disableGenericScrollZoom,{passive:false});
        window.addEventListener(EventType.KEY_DOWN, AppInitializer.disableUnwantedKeyBoardBehaviour);
        window.addEventListener(EventType.KEY_PRESS, AppInitializer.disableUnwantedKeyBoardBehaviour);
        ContextManager.init();
    }

    private static handleResize = () => {
        store.dispatch(updateWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        }));
    };

    private static initGA = () => {
        ReactGA.initialize(Settings.GA_TRACKING_CODE);
        ReactGA.pageview(window.location.pathname + window.location.search);
    };

    private static disableUnwantedKeyBoardBehaviour = (event: KeyboardEvent) => {
        if (PlatformModel.isMac && event.metaKey) {
            event.preventDefault();
        }

        if (["=", "+", "-"].includes(event.key)) {
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