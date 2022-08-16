import {BaseRenderEngine} from './BaseRenderEngine';
import {RenderEngineSettings} from '../../settings/RenderEngineSettings';
import {LabelType} from '../../data/enums/LabelType';
import {EditorData} from '../../data/EditorData';
import {RenderEngineUtil} from '../../utils/RenderEngineUtil';
import {ImageData, LabelLine} from '../../store/labels/types';
import {IPoint} from '../../interfaces/IPoint';
import {RectUtil} from '../../utils/RectUtil';
import {store} from '../../index';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from '../../store/labels/actionCreators';
import {EditorActions} from '../actions/EditorActions';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {DrawUtil} from '../../utils/DrawUtil';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import { v4 as uuidv4 } from 'uuid';
import {ILine} from '../../interfaces/ILine';
import {LineUtil} from '../../utils/LineUtil';
import {updateCustomCursorStyle} from '../../store/general/actionCreators';
import {CustomCursorStyle} from '../../data/enums/CustomCursorStyle';
import {LineAnchorType} from '../../data/enums/LineAnchorType';
import {Settings} from '../../settings/Settings';

export class LineRenderEngine extends BaseRenderEngine {

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
        const anchorTypeUnderMouse = this.getAnchorTypeUnderMouse(data);
        const labelLineUnderMouse: LabelLine = this.getLineUnderMouse(data);

        if (isMouseOverCanvas) {
            if (!!anchorTypeUnderMouse && !this.isResizeInProgress()) {
                this.startExistingLabelUpdate(labelLineUnderMouse.id, anchorTypeUnderMouse)
            } else if (labelLineUnderMouse !== null) {
                store.dispatch(updateActiveLabelId(labelLineUnderMouse.id));
            } else if (!this.isInProgress() && isMouseOverImage) {
                this.startNewLabelCreation(data)
            } else if (this.isInProgress()) {
                this.finishNewLabelCreation(data);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.isResizeInProgress()) {
            this.endExistingLabelUpdate(data)
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
            if (labelLine.isVisible) {
                const isActive: boolean = labelLine.id === activeLabelId || labelLine.id === highlightedLabelId;
                const lineOnCanvas = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLine.line, data)
                if (!(labelLine.id === activeLabelId && this.isResizeInProgress())) {
                    this.drawLine(labelLine.labelId, lineOnCanvas, isActive)
                }
            }
        });
    }

    private drawActivelyCreatedLabel(data: EditorData) {
        if (this.isInProgress()) {
            const line = {start: this.lineCreationStartPoint, end: data.mousePositionOnViewPortContent}
            DrawUtil.drawLine(this.canvas, line.start, line.end, RenderEngineSettings.lineActiveColor, RenderEngineSettings.LINE_THICKNESS);
            DrawUtil.drawCircleWithFill(this.canvas, this.lineCreationStartPoint, Settings.RESIZE_HANDLE_DIMENSION_PX/2, RenderEngineSettings.defaultAnchorColor)
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
            this.drawLine(activeLabelLine.labelId, lineToDraw, true)
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
            if (isMouseOverCanvas) {
                const anchorTypeUnderMouse = this.getAnchorTypeUnderMouse(data);
                if (!this.isInProgress() && !!anchorTypeUnderMouse) {
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                } else if (this.isResizeInProgress()) {
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                } else {
                    RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                }
                this.canvas.style.cursor = 'none';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    private drawLine(labelId: string, line: ILine, isActive: boolean) {
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelId, isActive)
        const anchorColor = BaseRenderEngine.resolveLabelAnchorColor(isActive)
        const standardizedLine: ILine = {
            start: RenderEngineUtil.setPointBetweenPixels(line.start),
            end: RenderEngineUtil.setPointBetweenPixels(line.end)
        }
        DrawUtil.drawLine(this.canvas, standardizedLine.start, standardizedLine.end, lineColor, RenderEngineSettings.LINE_THICKNESS);
        if (isActive) {

            LineUtil
                .getPoints(line)
                .forEach((point: IPoint) => DrawUtil.drawCircleWithFill(this.canvas, point,
                    Settings.RESIZE_HANDLE_DIMENSION_PX/2, anchorColor))
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

    // =================================================================================================================
    // CREATION
    // =================================================================================================================

    private startNewLabelCreation = (data: EditorData) => {
        this.lineCreationStartPoint = RenderEngineUtil.setPointBetweenPixels(data.mousePositionOnViewPortContent)
        EditorActions.setViewPortActionsDisabledStatus(true);
    }

    private finishNewLabelCreation = (data: EditorData) => {
        const mousePositionOnCanvasSnapped: IPoint = RectUtil.snapPointToRect(
            data.mousePositionOnViewPortContent, data.viewPortContentImageRect
        );
        const lineOnCanvas = {start: this.lineCreationStartPoint, end: mousePositionOnCanvasSnapped}
        const lineOnImage = RenderEngineUtil.transferLineFromViewPortContentToImage(lineOnCanvas, data);
        const activeLabelId = LabelsSelector.getActiveLabelNameId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const labelLine: LabelLine = {
            id: uuidv4(),
            labelId: activeLabelId,
            line: lineOnImage,
            isVisible: true
        };
        imageData.labelLines.push(labelLine);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelLine.id));
        this.lineCreationStartPoint = null
        EditorActions.setViewPortActionsDisabledStatus(false);
    };

    public cancelLabelCreation() {
        this.lineCreationStartPoint = null
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    // =================================================================================================================
    // UPDATE
    // =================================================================================================================

    private startExistingLabelUpdate(labelId: string, anchorType: LineAnchorType) {
        store.dispatch(updateActiveLabelId(labelId));
        this.lineUpdateAnchorType = anchorType;
        EditorActions.setViewPortActionsDisabledStatus(true);
    }

    private endExistingLabelUpdate(data: EditorData) {
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

    private getLineUnderMouse(data: EditorData): LabelLine | null {
        const mouseOnCanvas = data.mousePositionOnViewPortContent;
        if (!mouseOnCanvas) return null;

        const labelLines: LabelLine[] = LabelsSelector
            .getActiveImageData()
            .labelLines
            .filter((labelLine: LabelLine) => labelLine.isVisible);
        const radius = RenderEngineSettings.anchorHoverSize.width / 2;

        for (const labelLine of labelLines) {
            const lineOnCanvas: ILine = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLine.line, data);
            if (RenderEngineUtil.isMouseOverLine(mouseOnCanvas, lineOnCanvas, radius)) return labelLine;
        }
        return null;
    }

    private getAnchorTypeUnderMouse(data: EditorData): LineAnchorType | null {
        const mouseOnCanvas = data.mousePositionOnViewPortContent;
        if (!mouseOnCanvas) return null;

        const labelLines: LabelLine[] = LabelsSelector
            .getActiveImageData()
            .labelLines
            .filter((labelLine: LabelLine) => labelLine.isVisible);
        const radius = RenderEngineSettings.anchorHoverSize.width / 2;

        for (const labelLine of labelLines) {
            const lineOnCanvas: ILine = RenderEngineUtil.transferLineFromImageToViewPortContent(labelLine.line, data);
            if (RenderEngineUtil.isMouseOverAnchor(mouseOnCanvas, lineOnCanvas.start, radius)) {
                return LineAnchorType.START
            }
            if (RenderEngineUtil.isMouseOverAnchor(mouseOnCanvas, lineOnCanvas.end, radius)) {
                return LineAnchorType.END
            }
        }
        return null;
    }
}
