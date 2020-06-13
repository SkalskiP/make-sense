import {BaseRenderEngine} from "./BaseRenderEngine";
import {RenderEngineConfig} from "../../settings/RenderEngineConfig";
import {LabelType} from "../../data/enums/LabelType";
import {EditorData} from "../../data/EditorData";
import {RenderEngineUtil} from "../../utils/RenderEngineUtil";
import {ImageData, LabelLine} from "../../store/labels/types";
import {IPoint} from "../../interfaces/IPoint";
import {RectUtil} from "../../utils/RectUtil";
import {store} from "../../index";
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from "../../store/labels/actionCreators";
import {EditorActions} from "../actions/EditorActions";
import {LabelsSelector} from "../../store/selectors/LabelsSelector";
import {DrawUtil} from "../../utils/DrawUtil";
import {GeneralSelector} from "../../store/selectors/GeneralSelector";
import {CanvasUtil} from "../../utils/CanvasUtil";
import uuidv1 from "uuid/v1";
import {ILine} from "../../interfaces/ILine";
import {LineUtil} from "../../utils/LineUtil";
import {IRect} from "../../interfaces/IRect";

export class LineRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private startLinePoint: IPoint;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.LINE;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);

        if (isMouseOverCanvas) {
            if (!this.isInProgress()) {
                if (isMouseOverImage) {
                    this.startLinePoint = RenderEngineUtil.setPointBetweenPixels(data.mousePositionOnViewPortContent)
                    EditorActions.setViewPortActionsDisabledStatus(true);
                }
            } else {
                const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(
                    data.mousePositionOnViewPortContent, data.viewPortContentImageRect
                );
                const line = {start: this.startLinePoint, end: mousePositionSnapped}
                const lineOnImage = RenderEngineUtil.transferLineFromViewPortContentToImage(line, data)
                this.addLineLabel(lineOnImage)
                this.startLinePoint = null
                EditorActions.setViewPortActionsDisabledStatus(false);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        console.log("MOUSE UP")
    }

    public mouseMoveHandler(data: EditorData): void {
        const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        if (isOverImage) {
            const labelLine: LabelLine = this.getLineUnderMouse(data)
            if (!!labelLine) {
                if (LabelsSelector.getHighlightedLabelId() !== labelLine.id) {
                    store.dispatch(updateHighlightedLabelId(labelLine.id))
                }
            } else {
                if (LabelsSelector.getHighlightedLabelId() !== null) {
                    store.dispatch(updateHighlightedLabelId(null));
                }
            }
        }
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        this.drawExistingLabels(data);
        this.drawActivelyCreatedLabel(data)
        this.updateCursorStyle(data);
    }

    private drawExistingLabels(data: EditorData) {
        const activeLabelId: string = LabelsSelector.getActiveLabelId();
        const highlightedLabelId: string = LabelsSelector.getHighlightedLabelId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        imageData.labelLines.forEach((labelLine: LabelLine) => {
            const isActive: boolean = labelLine.id === activeLabelId || labelLine.id === highlightedLabelId;
            const lineOnCanvas = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLine.line, data)
            this.drawLine(lineOnCanvas, isActive)
        });
    }

    private drawActivelyCreatedLabel(data: EditorData) {
        if (this.isInProgress()) {
            const line = {start: this.startLinePoint, end: data.mousePositionOnViewPortContent}
            DrawUtil.drawLine(this.canvas, line.start, line.end, this.config.lineActiveColor, this.config.lineThickness);
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            if (RectUtil.isPointInside(
                {x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)},
                data.mousePositionOnViewPortContent)
            ) {
                RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                this.canvas.style.cursor = "none";
            } else {
                this.canvas.style.cursor = "default";
            }
        }
    }

    private drawLine(line: ILine, isActive: boolean) {
        const color: string = isActive ? this.config.lineActiveColor : this.config.lineInactiveColor;
        const standardizedLine: ILine = {
            start: RenderEngineUtil.setPointBetweenPixels(line.start),
            end: RenderEngineUtil.setPointBetweenPixels(line.end)
        }
        DrawUtil.drawLine(this.canvas, standardizedLine.start, standardizedLine.end, color, this.config.lineThickness);
        if (isActive) {
            LineUtil
                .getPoints(line)
                .map((point: IPoint) => RectUtil.getRectWithCenterAndSize(point, this.config.anchorSize))
                .forEach((handleRect: IRect) => {
                    DrawUtil.drawRectWithFill(this.canvas, handleRect, this.config.activeAnchorColor);
                })
        }
    }

    // =================================================================================================================
    // VALIDATORS
    // =================================================================================================================

    public isInProgress(): boolean {
        return !!this.startLinePoint
    }

    // =================================================================================================================
    // CREATION
    // =================================================================================================================

    private addLineLabel = (line: ILine) => {
        const activeLabelId = LabelsSelector.getActiveLabelNameId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const labelLine: LabelLine = {
            id: uuidv1(),
            labelId: activeLabelId,
            line
        };
        imageData.labelLines.push(labelLine);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelLine.id));
    };

    // =================================================================================================================
    // GETTERS
    // =================================================================================================================

    private getLineUnderMouse(data: EditorData): LabelLine {
        const labelLines: LabelLine[] = LabelsSelector.getActiveImageData().labelLines;
        for (let i = 0; i < labelLines.length; i++) {
            const lineOnCanvas: ILine = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLines[i].line, data);
            const mouseOverLine = RenderEngineUtil.isMouseOverLine(
                data.mousePositionOnViewPortContent,
                lineOnCanvas,
                this.config.anchorHoverSize.width / 2
            )
            if (mouseOverLine) return labelLines[i]
        }
        return null;
    }
}