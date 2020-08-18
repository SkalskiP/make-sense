import {IRect} from "../../interfaces/IRect";
import {BaseRenderEngine} from "./BaseRenderEngine";
import {EditorData} from "../../data/EditorData";
import {EditorModel} from "../../staticModels/EditorModel";
import {ViewPortActions} from "../actions/ViewPortActions";
import {DrawUtil} from "../../utils/DrawUtil";
import {RenderEngineUtil} from "../../utils/RenderEngineUtil";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {IPoint} from "../../interfaces/IPoint";
import {GeneralSelector} from "../../store/selectors/GeneralSelector";
import {ProjectType} from "../../data/enums/ProjectType";
import {PopupWindowType} from "../../data/enums/PopupWindowType";

export class PrimaryEditorRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseMoveHandler(data: EditorData): void {}
    public mouseDownHandler(data: EditorData): void {}
    public mouseUpHandler(data: EditorData): void {}

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        this.drawImage(EditorModel.image, ViewPortActions.calculateViewPortContentImageRect());
        this.renderCrossHair(data);
    }

    public renderCrossHair(data: EditorData): void {
        if (!this.shouldRenderCrossHair(data)) return;

        const mouse = RenderEngineUtil.setPointBetweenPixels(data.mousePositionOnViewPortContent);
        const drawLine = (startPoint: IPoint, endPoint: IPoint) => {
            DrawUtil.drawLine(this.canvas, startPoint, endPoint, this.config.crossHairLineColor, 2)
        }
        drawLine(
            {x: mouse.x, y: 0},
            {x: mouse.x - 1, y: mouse.y - this.config.crossHairPadding}
        )
        drawLine(
            {x: mouse.x, y: mouse.y + this.config.crossHairPadding},
            {x: mouse.x - 1, y: data.viewPortContentSize.height}
        )
        drawLine(
            {x: 0, y: mouse.y},
            {x: mouse.x - this.config.crossHairPadding, y: mouse.y - 1}
        )
        drawLine(
            {x: mouse.x + this.config.crossHairPadding, y: mouse.y},
            {x: data.viewPortContentSize.width, y: mouse.y - 1}
        )
    }

    public shouldRenderCrossHair(data: EditorData): boolean {
        const isCrossHairVisible = GeneralSelector.getCrossHairVisibleStatus();
        const isImageInDragMode = GeneralSelector.getImageDragModeStatus();
        const projectType: ProjectType = GeneralSelector.getProjectType();
        const activePopupType: PopupWindowType = GeneralSelector.getActivePopupType();
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);

        return [
            !!this.canvas,
            isCrossHairVisible,
            !isImageInDragMode,
            projectType !== ProjectType.IMAGE_RECOGNITION,
            !activePopupType,
            isMouseOverCanvas
        ].every(Boolean)
    }

    public drawImage(image: HTMLImageElement, imageRect: IRect) {
        if (!!image && !!this.canvas) {
            const ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, imageRect.x, imageRect.y, imageRect.width, imageRect.height);
        }
    }

    isInProgress(): boolean {
        return false;
    }
}