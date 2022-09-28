import {IRect} from '../../interfaces/IRect';
import {RenderEngineSettings} from '../../settings/RenderEngineSettings';
import {IPoint} from '../../interfaces/IPoint';
import {CanvasUtil} from '../../utils/CanvasUtil';
import {store} from '../../index';
import {ImageData, LabelPoint} from '../../store/labels/types';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from '../../store/labels/actionCreators';
import {RectUtil} from '../../utils/RectUtil';
import {DrawUtil} from '../../utils/DrawUtil';
import {updateCustomCursorStyle} from '../../store/general/actionCreators';
import {CustomCursorStyle} from '../../data/enums/CustomCursorStyle';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {EditorData} from '../../data/EditorData';
import {BaseRenderEngine} from './BaseRenderEngine';
import {RenderEngineUtil} from '../../utils/RenderEngineUtil';
import {LabelType} from '../../data/enums/LabelType';
import {EditorActions} from '../actions/EditorActions';
import {EditorModel} from '../../staticModels/EditorModel';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {LabelStatus} from '../../data/enums/LabelStatus';
import {Settings} from '../../settings/Settings';
import {LabelUtil} from '../../utils/LabelUtil';

export class PointRenderEngine extends BaseRenderEngine {

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.POINT;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);

        if (isMouseOverCanvas) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnViewPortContent, data);
            if (!!labelPoint) {
                const pointOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToViewPortContent(labelPoint.point, data);
                const pointBetweenPixels = RenderEngineUtil.setPointBetweenPixels(pointOnCanvas);
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, RenderEngineSettings.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnViewPortContent)) {
                    store.dispatch(updateActiveLabelId(labelPoint.id));
                    EditorActions.setViewPortActionsDisabledStatus(true);
                    return;
                } else {
                    store.dispatch(updateActiveLabelId(null));
                    const pointOnImage: IPoint = RenderEngineUtil.transferPointFromViewPortContentToImage(data.mousePositionOnViewPortContent, data);
                    this.addPointLabel(pointOnImage);
                }
            } else if (isMouseOverImage) {
                const pointOnImage: IPoint = RenderEngineUtil.transferPointFromViewPortContentToImage(data.mousePositionOnViewPortContent, data);
                this.addPointLabel(pointOnImage);
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.isInProgress()) {
            const activeLabelPoint: LabelPoint = LabelsSelector.getActivePointLabel();
            const pointSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
            const pointOnImage: IPoint = RenderEngineUtil.transferPointFromViewPortContentToImage(pointSnapped, data);
            const imageData = LabelsSelector.getActiveImageData();

            imageData.labelPoints = imageData.labelPoints.map((labelPoint: LabelPoint) => {
                if (labelPoint.id === activeLabelPoint.id) {
                    return {
                        ...labelPoint,
                        point: pointOnImage
                    };
                }
                return labelPoint;
            });
            store.dispatch(updateImageDataById(imageData.id, imageData));
        }
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    public mouseMoveHandler(data: EditorData): void {
        const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
        if (isOverImage) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnViewPortContent, data);
            if (!!labelPoint) {
                if (LabelsSelector.getHighlightedLabelId() !== labelPoint.id) {
                    store.dispatch(updateHighlightedLabelId(labelPoint.id))
                }
            } else {
                if (LabelsSelector.getHighlightedLabelId() !== null) {
                    store.dispatch(updateHighlightedLabelId(null))
                }
            }
        }
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData): void {
        const activeLabelId: string = LabelsSelector.getActiveLabelId();
        const highlightedLabelId: string = LabelsSelector.getHighlightedLabelId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        if (imageData) {
            imageData.labelPoints.forEach((labelPoint: LabelPoint) => {
                if (labelPoint.isVisible) {
                    if (labelPoint.id === activeLabelId) {
                        if (this.isInProgress()) {
                            const pointSnapped: IPoint = RectUtil.snapPointToRect(data.mousePositionOnViewPortContent, data.viewPortContentImageRect);
                            const pointBetweenPixels: IPoint = RenderEngineUtil.setPointBetweenPixels(pointSnapped);
                            const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true);
                            DrawUtil.drawCircleWithFill(this.canvas, pointBetweenPixels, Settings.RESIZE_HANDLE_DIMENSION_PX/2, anchorColor)
                        } else {
                            this.renderPoint(labelPoint, true, data);
                        }
                    } else {
                        this.renderPoint(labelPoint, labelPoint.id === activeLabelId || labelPoint.id === highlightedLabelId, data);
                    }
                }
            });
        }
        this.updateCursorStyle(data);
    }

    private renderPoint(labelPoint: LabelPoint, isActive: boolean, data: EditorData) {
        const pointOnImage: IPoint = RenderEngineUtil.transferPointFromImageToViewPortContent(labelPoint.point, data);
        const pointBetweenPixels = RenderEngineUtil.setPointBetweenPixels(pointOnImage);
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(isActive);
        DrawUtil.drawCircleWithFill(this.canvas, pointBetweenPixels, Settings.RESIZE_HANDLE_DIMENSION_PX/2, anchorColor)
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            const labelPoint: LabelPoint = this.getLabelPointUnderMouse(data.mousePositionOnViewPortContent, data);
            if (!!labelPoint && labelPoint.status === LabelStatus.ACCEPTED) {
                const pointOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToViewPortContent(labelPoint.point, data);
                const pointBetweenPixels = RenderEngineUtil.setPointBetweenPixels(pointOnCanvas);
                const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointBetweenPixels, RenderEngineSettings.anchorHoverSize);
                if (RectUtil.isPointInside(handleRect, data.mousePositionOnViewPortContent)) {
                    store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                    return;
                }
            } else if (this.isInProgress()) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                return;
            }

            if (RectUtil.isPointInside({x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)}, data.mousePositionOnViewPortContent)) {
                RenderEngineUtil.wrapDefaultCursorStyleInCancel(data);
                this.canvas.style.cursor = 'none';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }
    }

    // =================================================================================================================
    // HELPERS
    // =================================================================================================================

    public isInProgress(): boolean {
        return EditorModel.viewPortActionsDisabled;
    }

    private getLabelPointUnderMouse(mousePosition: IPoint, data: EditorData): LabelPoint {
        const labelPoints: LabelPoint[] = LabelsSelector
            .getActiveImageData()
            .labelPoints
            .filter((labelPoint: LabelPoint) => labelPoint.isVisible);
        for (const labelPoint of labelPoints) {
            const pointOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToViewPortContent(labelPoint.point, data);
            const handleRect: IRect = RectUtil.getRectWithCenterAndSize(pointOnCanvas, RenderEngineSettings.anchorHoverSize);
            if (RectUtil.isPointInside(handleRect, mousePosition)) {
                return labelPoint;
            }
        }
        return null;
    }

    private addPointLabel = (point: IPoint) => {
        const activeLabelId = LabelsSelector.getActiveLabelNameId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const labelPoint: LabelPoint = LabelUtil.createLabelPoint(activeLabelId, point);
        imageData.labelPoints.push(labelPoint);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelPoint.id));
    };
}
