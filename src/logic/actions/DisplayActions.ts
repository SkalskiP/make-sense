import {EditorModel} from "../../staticModels/EditorModel";
import {NumberUtil} from "../../utils/NumberUtil";
import {DisplaySettings} from "../../settings/DisplaySettings";

export class DisplayActions {
    public static zoomIn() {
        const currentZoomPercentage: number = EditorModel.zoomPercentage;
        DisplayActions.setZoomPercentage(currentZoomPercentage + DisplaySettings.ZOOM_PERCENTAGE_STEP);
    }

    public static zoomOut() {
        const currentZoomPercentage: number = EditorModel.zoomPercentage;
        DisplayActions.setZoomPercentage(currentZoomPercentage - DisplaySettings.ZOOM_PERCENTAGE_STEP);
    }

    public static setZoomPercentage(value: number) {
        const currentZoomPercentage: number = EditorModel.zoomPercentage;
        const isNewValueValid: boolean = NumberUtil.isValueInRange(
            value, DisplaySettings.MIN_ZOOM_PERCENTAGE, DisplaySettings.MAX_ZOOM_PERCENTAGE);

        if (isNewValueValid && value !== currentZoomPercentage) {
            EditorModel.zoomPercentage = value;
        }
    }
}