import {MobileDeviceData} from "../data/MobileDeviceData";
import MobileDetect from 'mobile-detect'

export class PlatformUtil {
    public static getMobileDeviceData(userAgent: string): MobileDeviceData {
        const mobileDetect = new MobileDetect(userAgent);
        return {
            manufacturer: mobileDetect.mobile(),
            browser: mobileDetect.userAgent(),
            os: mobileDetect.os()
        }
    }

    public static isMac(userAgent: string): boolean {
        return !!userAgent.toLowerCase().match("mac");
    }

    public static isSafari(userAgent: string): boolean {
        return !!userAgent.toLowerCase().match("safari");
    }

    public static isFirefox(userAgent: string): boolean {
        return !!userAgent.toLowerCase().match("firefox");
    }
}