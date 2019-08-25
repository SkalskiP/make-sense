import {updateMobileDeviceData, updateWindowSize} from "../../store/general/actionCreators";
import {ContextManager} from "../context/ContextManager";
import MobileDetect from 'mobile-detect'
import {store} from "../../index";

export class AppInitializer {
    public static inti():void {
        AppInitializer.handleResize();
        AppInitializer.detectDeviceParams();
        window.addEventListener("resize", AppInitializer.handleResize);
        ContextManager.init();
    }

    private static handleResize = () => {
        store.dispatch(updateWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        }));
    };

    private static detectDeviceParams = () => {
        const mobileDetect = new MobileDetect(window.navigator.userAgent);
        store.dispatch(updateMobileDeviceData({
            manufacturer: mobileDetect.mobile(),
            browser: mobileDetect.userAgent(),
            os: mobileDetect.os()
        }))
    };
}