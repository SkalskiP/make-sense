import {ISize} from "../interfaces/ISize";
import {Settings} from "./Settings";

export class RenderEngineConfig {
    public readonly lineThickness: number = 2;
    public readonly lineActiveColor: string = Settings.PRIMARY_COLOR;
    public readonly lineInactiveColor: string = "#fff";
    public readonly anchorSize: ISize = {
        width: Settings.RESIZE_HANDLE_DIMENSION_PX,
        height: Settings.RESIZE_HANDLE_DIMENSION_PX
    };
    public readonly anchorHoverSize: ISize = {
        width: Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX,
        height: Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX
    };
    public readonly suggestedAnchorDetectionSize: ISize = {
        width: 100,
        height: 100
    };
    public readonly activeAnchorColor: string = Settings.SECONDARY_COLOR;
    public readonly inactiveAnchorColor: string = Settings.DARK_THEME_SECOND_COLOR;
}