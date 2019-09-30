import {Settings} from "../../settings/Settings";
import {AISelector} from "../../store/selectors/AISelector";

export class CSSHelper {
    public static getLeadingColor(): string {
        return AISelector.isAIObjectDetectorModelLoaded() ||
            AISelector.isAIPoseDetectorModelLoaded() ? Settings.PRIMARY_COLOR : Settings.SECONDARY_COLOR;
    }
}