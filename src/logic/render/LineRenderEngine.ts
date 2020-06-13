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
import uuidv1 from "uuid/v1";
import {ILine} from "../../interfaces/ILine";
import {LineUtil} from "../../utils/LineUtil";
import {IRect} from "../../interfaces/IRect";
import {updateCustomCursorStyle} from "../../store/general/actionCreators";
import {CustomCursorStyle} from "../../data/enums/CustomCursorStyle";
import {LineAnchorType} from "../../data/enums/LineAnchorType";

export class LineRenderEngine extends BaseRenderEngine {
    private config: RenderEngineConfig = new RenderEngineConfig();

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private lineCreationStartPoint: IPoint;
    private lineUpdateAnchorType: LineAnchorType;

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
            const anchorTypeUnderMouse = this.getAnchorTypeUnderMouse(data);
            if (!!anchorTypeUnderMouse && !this.isResizeInProgress()) {
                const labelLine: LabelLine = this.getLineUnderMouse(data);
                this.startExistingLabelResize(labelLine.id, anchorTypeUnderMouse)
            } else if (!this.isInProgress()) {
                if (isMouseOverImage) {
                    this.lineCreationStartPoint = RenderEngineUtil.setPointBetweenPixels(data.mousePositionOnViewPortContent)
                    EditorActions.setViewPortActionsDisabledStatus(true);
                }
            } else {
                const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(
                    data.mousePositionOnViewPortContent, data.viewPortContentImageRect
                );
                const line = {start: this.lineCreationStartPoint, end: mousePositionSnapped}
                const lineOnImage = RenderEngineUtil.transferLineFromViewPortContentToImage(line, data)
                this.addLineLabel(lineOnImage)
                this.lineCreationStartPoint = null
                EditorActions.setViewPortActionsDisabledStatus(false);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.isResizeInProgress()) {
            this.endExistingLabelResize(data)
        }
    }

    public mouseMoveHandler(data: EditorData): void {
        const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        if (isOverImage) {
            const labelLine: LabelLine = this.getLineUnderMouse(data);
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
        this.drawActivelyResizeLabel(data)
        this.updateCursorStyle(data);
    }

    private drawExistingLabels(data: EditorData) {
        const activeLabelId: string = LabelsSelector.getActiveLabelId();
        const highlightedLabelId: string = LabelsSelector.getHighlightedLabelId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        imageData.labelLines.forEach((labelLine: LabelLine) => {
            const isActive: boolean = labelLine.id === activeLabelId || labelLine.id === highlightedLabelId;
            const lineOnCanvas = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLine.line, data)
            if (!(labelLine.id === activeLabelId && this.isResizeInProgress())) {
                this.drawLine(lineOnCanvas, isActive)
            }
        });
    }

    private drawActivelyCreatedLabel(data: EditorData) {
        if (this.isInProgress()) {
            const line = {start: this.lineCreationStartPoint, end: data.mousePositionOnViewPortContent}
            DrawUtil.drawLine(this.canvas, line.start, line.end, this.config.lineActiveColor, this.config.lineThickness);
            const lineStartHandle = RectUtil.getRectWithCenterAndSize(this.lineCreationStartPoint, this.config.anchorSize);
            DrawUtil.drawRectWithFill(this.canvas, lineStartHandle, this.config.activeAnchorColor);
        }
    }

    private drawActivelyResizeLabel(data: EditorData) {
        const activeLabelLine: LabelLine = LabelsSelector.getActiveLineLabel();
        if (!!activeLabelLine && this.isResizeInProgress()) {
            const snappedMousePosition: IPoint =
                RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            const lineOnCanvas = RenderEngineUtil.transferLineFromImageToViewPortContent(activeLabelLine.line, data)
            const lineToDraw = {
                start: this.lineUpdateAnchorType === LineAnchorType.START ? snappedMousePosition : lineOnCanvas.start,
                end: this.lineUpdateAnchorType === LineAnchorType.END ? snappedMousePosition : lineOnCanvas.end
            }
            this.drawLine(lineToDraw, true)
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
            if (isMouseOverCanvas) {
                const anchorTypeUnderMouse = this.getAnchorTypeUnderMouse(data);
                if (!this.isInProgress() && !!anchorTypeUnderMouse) {
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                } else {
                    RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                }
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
        return !!this.lineCreationStartPoint
    }

    public isResizeInProgress(): boolean {
        return !!this.lineUpdateAnchorType;
    }

    private isMouseOverAnchor(mouse: IPoint, anchor: IPoint): boolean {
        if (!mouse || !anchor) return null;
        return RectUtil.isPointInside(RectUtil.getRectWithCenterAndSize(anchor, this.config.anchorSize), mouse);
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
    // UPDATE
    // =================================================================================================================

    private startExistingLabelResize(labelId: string, anchorType: LineAnchorType) {
        store.dispatch(updateActiveLabelId(labelId));
        this.lineUpdateAnchorType = anchorType;
        EditorActions.setViewPortActionsDisabledStatus(true);
    }

    private endExistingLabelResize(data: EditorData) {
        this.applyUpdateToLineLabel(data);
        this.lineUpdateAnchorType = null;
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    private applyUpdateToLineLabel(data: EditorData) {
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const activeLabel: LabelLine = LabelsSelector.getActiveLineLabel();
        imageData.labelLines = imageData.labelLines.map((lineLabel: LabelLine) => {
            if (lineLabel.id !== activeLabel.id) {
                return lineLabel
            } else {
                const snappedMousePosition: IPoint =
                    RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
                const mousePositionOnImage = RenderEngineUtil.transferPointFromViewPortContentToImage(
                    snappedMousePosition, data
                );
                return {
                    ...lineLabel,
                    line: {
                        start: this.lineUpdateAnchorType === LineAnchorType.START ? mousePositionOnImage : lineLabel.line.start,
                        end: this.lineUpdateAnchorType === LineAnchorType.END ? mousePositionOnImage : lineLabel.line.end
                    }
                }
            }
        });

        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateActiveLabelId(activeLabel.id));
    }

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

    private getAnchorTypeUnderMouse(data: EditorData): LineAnchorType {
        const labelLines: LabelLine[] = LabelsSelector.getActiveImageData().labelLines;
        for (let i = 0; i < labelLines.length; i++) {
            const lineOnCanvas: ILine = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLines[i].line, data);
            if (this.isMouseOverAnchor(data.mousePositionOnViewPortContent, lineOnCanvas.start)) {
                return LineAnchorType.START
            }
            if (this.isMouseOverAnchor(data.mousePositionOnViewPortContent, lineOnCanvas.end)) {
                return LineAnchorType.END
            }
        }
        return null;
    }
}