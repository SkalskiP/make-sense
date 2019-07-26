import {ISize} from "../interfaces/ISize";
import {Settings} from "./Settings";

export class RectRenderEngineConfig {
    public readonly rectThickness: number = 2;
    public readonly rectActiveColor: string = Settings.SECONDARY_COLOR;
    public readonly rectInactiveColor: string = Settings.DARK_THEME_THIRD_COLOR;
    public readonly rectAnchorSize: ISize = {
        width: Settings.RESIZE_HANDLE_DIMENSION_PX,
        height: Settings.RESIZE_HANDLE_DIMENSION_PX
    };
    public readonly rectAnchorHoverSize: ISize = {
        width: Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX,
        height: Settings.RESIZE_HANDLE_HOVER_DIMENSION_PX
    };
    public readonly rectActiveAnchorColor: string = Settings.PRIMARY_COLOR;
    public readonly rectInactiveAnchorColor: string = Settings.DARK_THEME_SECOND_COLOR;
}