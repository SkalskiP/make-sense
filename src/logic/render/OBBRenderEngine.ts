import {store} from '../../index';
import {RectUtil} from '../../utils/RectUtil';
import {updateCustomCursorStyle} from '../../store/general/actionCreators';
import {CustomCursorStyle} from '../../data/enums/CustomCursorStyle';
import {EditorData} from '../../data/EditorData';
import {BaseRenderEngine} from './BaseRenderEngine';
import {RenderEngineSettings} from '../../settings/RenderEngineSettings';
import {IPoint} from '../../interfaces/IPoint';
import {DrawUtil} from '../../utils/DrawUtil';
import {IRect} from '../../interfaces/IRect';
import {ImageData, LabelOBB} from '../../store/labels/types';
import {LabelsSelector} from '../../store/selectors/LabelsSelector';
import {
    updateActiveLabelId,
    updateFirstLabelCreatedFlag,
    updateHighlightedLabelId,
    updateImageDataById
} from '../../store/labels/actionCreators';
import {MouseEventUtil} from '../../utils/MouseEventUtil';
import {EventType} from '../../data/enums/EventType';
import {RenderEngineUtil} from '../../utils/RenderEngineUtil';
import {LabelType} from '../../data/enums/LabelType';
import {EditorActions} from '../actions/EditorActions';
import {GeneralSelector} from '../../store/selectors/GeneralSelector';
import {LabelUtil} from '../../utils/LabelUtil';
import {PointUtil} from '../../utils/PointUtil';
import {LabelStatus} from '../../data/enums/LabelStatus';

export class OBBRenderEngine extends BaseRenderEngine {

    // =================================================================================================================
    // STATE
    // =================================================================================================================

    private activePath: IPoint[] = [];
    private resizeAnchorIndex: number = null;
    private resizeEdgeIndex: number = null;

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.labelType = LabelType.OBB;
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    public update(data: EditorData): void {
        if (!!data.event) {
            switch (MouseEventUtil.getEventType(data.event)) {
                case EventType.MOUSE_MOVE:
                    this.mouseMoveHandler(data);
                    break;
                case EventType.MOUSE_UP:
                    this.mouseUpHandler(data);
                    break;
                case EventType.MOUSE_DOWN:
                    this.mouseDownHandler(data);
                    break;
                default:
                    break;
            }
        }
    }

    public mouseDownHandler(data: EditorData): void {
        const isMouseOverCanvas: boolean = RenderEngineUtil.isMouseOverCanvas(data);
        if (isMouseOverCanvas) {
            if (this.isCreationInProgress()) {
                this.updateActivelyCreatedLabel(data);
            } else {
                const obbUnderMouse: LabelOBB = this.getOBBUnderMouse(data);
                if (!!obbUnderMouse) {
                    // Check corner anchors first
                    const anchorIndex: number = obbUnderMouse.vertices.reduce(
                        (indexUnderMouse: number, anchor: IPoint, index: number) => {
                        if (indexUnderMouse === null) {
                            const anchorOnCanvas: IPoint = RenderEngineUtil.transferPointFromImageToViewPortContent(anchor, data);
                            if (this.isMouseOverAnchor(data.mousePositionOnViewPortContent, anchorOnCanvas)) {
                                return index;
                            }
                        }
                        return indexUnderMouse;
                    }, null);

                    if (anchorIndex !== null) {
                        this.startExistingLabelResize(data, obbUnderMouse.id, anchorIndex);
                    } else {
                        // Check edge anchors
                        const edgeIndex = this.getEdgeUnderMouse(obbUnderMouse.vertices, data);
                        if (edgeIndex !== null) {
                            this.startExistingLabelEdgeResize(data, obbUnderMouse.id, edgeIndex);
                        } else {
                            store.dispatch(updateActiveLabelId(obbUnderMouse.id));
                        }
                    }
                } else {
                    this.updateActivelyCreatedLabel(data);
                }
            }
        }
    }

    public mouseUpHandler(data: EditorData): void {
        if (this.isResizeInProgress())
            this.endExistingLabelResize(data);
        if (this.isEdgeResizeInProgress())
            this.endExistingLabelEdgeResize(data);
    }

    public mouseMoveHandler(data: EditorData): void {
        if (!!data.viewPortContentImageRect && !!data.mousePositionOnViewPortContent) {
            const isOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
            if (isOverImage && !this.isCreationInProgress()) {
                const labelOBB: LabelOBB = this.getOBBUnderMouse(data);
                if (!!labelOBB && !this.isResizeInProgress() && !this.isEdgeResizeInProgress()) {
                    if (LabelsSelector.getHighlightedLabelId() !== labelOBB.id) {
                        store.dispatch(updateHighlightedLabelId(labelOBB.id))
                    }
                } else {
                    if (LabelsSelector.getHighlightedLabelId() !== null) {
                        store.dispatch(updateHighlightedLabelId(null));
                    }
                }
            }
        }
    }

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    public render(data: EditorData) {
        const activeLabelId: string = LabelsSelector.getActiveLabelId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        if (imageData) {
            imageData.labelOBBs?.forEach((labelOBB: LabelOBB) => {
                if (labelOBB.isVisible) {
                    if (labelOBB.status === LabelStatus.ACCEPTED && labelOBB.id === activeLabelId) {
                        this.drawActiveOBB(labelOBB, data)
                    } else {
                        this.drawInactiveOBB(labelOBB, data);
                    }
                }
            });
            this.drawCurrentlyCreatedOBB(data);
            this.updateCursorStyle(data);
        }
    }

    private drawCurrentlyCreatedOBB(data: EditorData) {
        if (this.activePath.length > 0) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(
                data.mousePositionOnViewPortContent, 
                data.viewPortContentImageRect
            );
            
            let pathToDraw: IPoint[] = [...this.activePath];
            
            if (this.activePath.length === 1) {
                // Drawing first edge
                pathToDraw.push(mousePositionSnapped);
            } else if (this.activePath.length === 2) {
                // Complete the rectangle
                const p1 = this.activePath[0];
                const p2 = this.activePath[1];
                
                // Calculate perpendicular vector
                const edge = PointUtil.subtract(p2, p1);
                const perpendicular = { x: -edge.y, y: edge.x };
                
                // Project mouse position onto perpendicular direction
                const toMouse = PointUtil.subtract(mousePositionSnapped, p1);
                const projection = (toMouse.x * perpendicular.x + toMouse.y * perpendicular.y) / 
                                 (perpendicular.x * perpendicular.x + perpendicular.y * perpendicular.y);
                
                const offset = { x: perpendicular.x * projection, y: perpendicular.y * projection };
                const p3 = PointUtil.add(p2, offset);
                const p4 = PointUtil.add(p1, offset);
                
                pathToDraw = [p1, p2, p3, p4];
            }
            
            const lineColor: string = BaseRenderEngine.resolveLabelLineColor(null, true);
            DrawUtil.drawPolygon(this.canvas, pathToDraw, lineColor, RenderEngineSettings.LINE_THICKNESS);
            
            // Draw anchors
            pathToDraw.forEach((point: IPoint) => {
                DrawUtil.drawCircleWithFill(
                    this.canvas,
                    point,
                    RenderEngineSettings.anchorSize.width / 2,
                    BaseRenderEngine.resolveLabelAnchorColor(true)
                );
            });
        }
    }

    private drawInactiveOBB(labelOBB: LabelOBB, data: EditorData) {
        const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToViewPortContent(labelOBB.vertices, data);
        const highlightedLabelId: string = LabelsSelector.getHighlightedLabelId();
        const displayAsActive: boolean = labelOBB.status === LabelStatus.ACCEPTED && labelOBB.id === highlightedLabelId;
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelOBB.labelId, displayAsActive);
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(displayAsActive);
        this.renderOBB(pathOnCanvas, displayAsActive, lineColor, anchorColor);
    }

    private drawActiveOBB(labelOBB: LabelOBB, data: EditorData) {
        let pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToViewPortContent(labelOBB.vertices, data);
        
        if (this.isResizeInProgress()) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(
                data.mousePositionOnViewPortContent,
                data.viewPortContentImageRect
            );
            pathOnCanvas = this.calculateRectangleCorners(pathOnCanvas, this.resizeAnchorIndex, snappedMousePosition);
        } else if (this.isEdgeResizeInProgress()) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(
                data.mousePositionOnViewPortContent,
                data.viewPortContentImageRect
            );
            pathOnCanvas = this.calculateRectangleFromEdgeDrag(pathOnCanvas, this.resizeEdgeIndex, snappedMousePosition);
        }
        
        const lineColor: string = BaseRenderEngine.resolveLabelLineColor(labelOBB.labelId, true);
        const anchorColor: string = BaseRenderEngine.resolveLabelAnchorColor(true);
        this.renderOBB(pathOnCanvas, true, lineColor, anchorColor);
    }

    private renderOBB(pathOnCanvas: IPoint[], isActive: boolean, lineColor: string, anchorColor: string) {
        DrawUtil.drawPolygonWithFill(this.canvas, pathOnCanvas, DrawUtil.hexToRGB(lineColor, 0.2));
        DrawUtil.drawPolygon(this.canvas, pathOnCanvas, lineColor, RenderEngineSettings.LINE_THICKNESS);
        
        if (isActive) {
            // Draw corner anchors
            pathOnCanvas.forEach((point: IPoint) => {
                DrawUtil.drawCircleWithFill(this.canvas, point, RenderEngineSettings.anchorSize.width / 2, anchorColor);
            });
            
            // Draw edge anchors (midpoints)
            for (let i = 0; i < pathOnCanvas.length; i++) {
                const nextIndex = (i + 1) % pathOnCanvas.length;
                const edgeMidpoint = {
                    x: (pathOnCanvas[i].x + pathOnCanvas[nextIndex].x) / 2,
                    y: (pathOnCanvas[i].y + pathOnCanvas[nextIndex].y) / 2
                };
                DrawUtil.drawRectWithFill(this.canvas, RectUtil.getRectWithCenterAndSize(edgeMidpoint, RenderEngineSettings.anchorSize), anchorColor);
            }
        }
    }

    private updateCursorStyle(data: EditorData) {
        if (!!this.canvas && !!data.mousePositionOnViewPortContent && !GeneralSelector.getImageDragModeStatus()) {
            const obbUnderMouse: LabelOBB = this.getOBBUnderMouse(data);
            if ((!!obbUnderMouse && obbUnderMouse.status === LabelStatus.ACCEPTED) || this.isInProgress()) {
                store.dispatch(updateCustomCursorStyle(CustomCursorStyle.MOVE));
                this.canvas.style.cursor = 'none';
                return;
            }
            else if (RenderEngineUtil.isMouseOverCanvas(data)) {
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
        return this.isCreationInProgress() || this.isResizeInProgress() || this.isEdgeResizeInProgress();
    }

    private isCreationInProgress(): boolean {
        return this.activePath.length > 0 && this.activePath.length < 3;
    }

    private isResizeInProgress(): boolean {
        return this.resizeAnchorIndex !== null;
    }

    private isEdgeResizeInProgress(): boolean {
        return this.resizeEdgeIndex !== null;
    }

    private updateActivelyCreatedLabel = (data: EditorData) => {
        if (this.isCreationInProgress()) {
            const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(
                data.mousePositionOnViewPortContent,
                data.viewPortContentImageRect
            );
            this.activePath.push(mousePositionSnapped);
            
            if (this.activePath.length === 3) {
                this.addLabelAndFinishCreation(data);
            }
        } else {
            const isMouseOverImage: boolean = RenderEngineUtil.isMouseOverImage(data);
            if (isMouseOverImage) {
                this.startLabelCreation(data);
            }
        }
    };

    private startLabelCreation = (data: EditorData) => {
        const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(
            data.mousePositionOnViewPortContent,
            data.viewPortContentImageRect
        );
        this.activePath.push(mousePositionSnapped);
        store.dispatch(updateActiveLabelId(null));
        EditorActions.setViewPortActionsDisabledStatus(true);
    };

    private addLabelAndFinishCreation = (data: EditorData) => {
        const mousePositionSnapped: IPoint = RectUtil.snapPointToRect(
            data.mousePositionOnViewPortContent,
            data.viewPortContentImageRect
        );
        
        // Complete the rectangle
        const p1 = this.activePath[0];
        const p2 = this.activePath[1];
        
        // Calculate perpendicular vector
        const edge = PointUtil.subtract(p2, p1);
        const perpendicular = { x: -edge.y, y: edge.x };
        
        // Project mouse position onto perpendicular direction
        const toMouse = PointUtil.subtract(mousePositionSnapped, p1);
        const projection = (toMouse.x * perpendicular.x + toMouse.y * perpendicular.y) / 
                         (perpendicular.x * perpendicular.x + perpendicular.y * perpendicular.y);
        
        const offset = { x: perpendicular.x * projection, y: perpendicular.y * projection };
        const p3 = PointUtil.add(p2, offset);
        const p4 = PointUtil.add(p1, offset);
        
        const pathOnImage: IPoint[] = [p1, p2, p3, p4].map((point: IPoint) => {
            return RenderEngineUtil.transferPointFromViewPortContentToImage(point, data);
        });
        
        this.addOBBLabel(pathOnImage);
        this.endLabelCreation();
    };

    private endLabelCreation() {
        this.activePath = [];
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    public cancelLabelCreation() {
        this.activePath = [];
        EditorActions.setViewPortActionsDisabledStatus(false);
    }

    private addOBBLabel = (vertices: IPoint[]) => {
        const activeLabelId = LabelsSelector.getActiveLabelNameId();
        const imageData: ImageData = LabelsSelector.getActiveImageData();
        const labelOBB: LabelOBB = LabelUtil.createLabelOBB(activeLabelId, vertices);
        
        if (!imageData.labelOBBs) {
            imageData.labelOBBs = [];
        }
        
        imageData.labelOBBs.push(labelOBB);
        store.dispatch(updateImageDataById(imageData.id, imageData));
        store.dispatch(updateFirstLabelCreatedFlag(true));
        store.dispatch(updateActiveLabelId(labelOBB.id));
    };

    private getOBBUnderMouse(data: EditorData): LabelOBB {
        const labelOBBs: LabelOBB[] = LabelsSelector.getActiveImageData().labelOBBs || [];
        
        for (const labelOBB of labelOBBs) {
            if (labelOBB.isVisible && this.isMouseOverOBB(labelOBB.vertices, data)) {
                return labelOBB;
            }
        }
        return null;
    }

    private isMouseOverOBB(vertices: IPoint[], data: EditorData): boolean {
        const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToViewPortContent(vertices, data);
        
        // Check if mouse is over any anchor
        for (let i = 0; i < pathOnCanvas.length; i++) {
            if (this.isMouseOverAnchor(data.mousePositionOnViewPortContent, pathOnCanvas[i])) {
                return true;
            }
        }
        
        // Check if mouse is inside the OBB or near edges
        return this.isPointInsidePolygon(data.mousePositionOnViewPortContent, pathOnCanvas);
    }

    private isPointInsidePolygon(point: IPoint, polygon: IPoint[]): boolean {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;
            
            const intersect = ((yi > point.y) !== (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    private isMouseOverAnchor(mouse: IPoint, anchor: IPoint): boolean {
        const anchorRect: IRect = RectUtil.getRectWithCenterAndSize(anchor, RenderEngineSettings.anchorHoverSize);
        return RectUtil.isPointInside(anchorRect, mouse);
    }

    private calculateRectangleCorners(originalVertices: IPoint[], draggedIndex: number, newPosition: IPoint): IPoint[] {
        // The opposite corner is the anchor (stays fixed)
        const anchorIndex = (draggedIndex + 2) % 4;
        const anchor = originalVertices[anchorIndex];
        
        // Get the two adjacent corners (these share an edge with the anchor)
        const adj1Index = (anchorIndex + 1) % 4;
        const adj2Index = (anchorIndex + 3) % 4;
        
        // Calculate original edge vectors from anchor
        const origEdge1 = PointUtil.subtract(originalVertices[adj1Index], anchor);
        const origEdge2 = PointUtil.subtract(originalVertices[adj2Index], anchor);
        const origDiagonal = PointUtil.subtract(originalVertices[draggedIndex], anchor);
        
        const origEdge1Length = Math.sqrt(origEdge1.x * origEdge1.x + origEdge1.y * origEdge1.y);
        const origEdge2Length = Math.sqrt(origEdge2.x * origEdge2.x + origEdge2.y * origEdge2.y);
        const origDiagLength = Math.sqrt(origDiagonal.x * origDiagonal.x + origDiagonal.y * origDiagonal.y);
        
        if (origEdge1Length === 0 || origEdge2Length === 0 || origDiagLength === 0) {
            return originalVertices;
        }
        
        // Calculate which edge is more aligned with the diagonal (using dot product)
        const origEdge1Norm = { x: origEdge1.x / origEdge1Length, y: origEdge1.y / origEdge1Length };
        const origEdge2Norm = { x: origEdge2.x / origEdge2Length, y: origEdge2.y / origEdge2Length };
        const origDiagNorm = { x: origDiagonal.x / origDiagLength, y: origDiagonal.y / origDiagLength };
        
        const dot1 = origEdge1Norm.x * origDiagNorm.x + origEdge1Norm.y * origDiagNorm.y;
        const dot2 = origEdge2Norm.x * origDiagNorm.x + origEdge2Norm.y * origDiagNorm.y;
        
        // Determine which edge is primary (more aligned with diagonal)
        let primaryEdge: IPoint, secondaryEdge: IPoint;
        let primaryIndex: number, secondaryIndex: number;
        let primaryLength: number, secondaryLength: number;
        
        if (Math.abs(dot1) >= Math.abs(dot2)) {
            primaryEdge = origEdge1;
            secondaryEdge = origEdge2;
            primaryIndex = adj1Index;
            secondaryIndex = adj2Index;
            primaryLength = origEdge1Length;
            secondaryLength = origEdge2Length;
        } else {
            primaryEdge = origEdge2;
            secondaryEdge = origEdge1;
            primaryIndex = adj2Index;
            secondaryIndex = adj1Index;
            primaryLength = origEdge2Length;
            secondaryLength = origEdge1Length;
        }
        
        // Calculate the angle between the primary edge and the diagonal in the original rectangle
        // Using: cos(angle) = dot(primary, diagonal) / (|primary| * |diagonal|)
        const cosAngle = (primaryEdge.x * origDiagonal.x + primaryEdge.y * origDiagonal.y) / (primaryLength * origDiagLength);
        const sinAngle = Math.sqrt(1 - cosAngle * cosAngle);
        
        // tan(angle) = opposite/adjacent = secondaryLength / primaryLength (from right triangle)
        // This angle must be preserved to maintain the rectangle geometry
        
        // New diagonal
        const newDiagonal = PointUtil.subtract(newPosition, anchor);
        const newDiagLength = Math.sqrt(newDiagonal.x * newDiagonal.x + newDiagonal.y * newDiagonal.y);
        
        if (newDiagLength === 0) {
            return originalVertices;
        }
        
        // New edge lengths (scaled proportionally based on diagonal change)
        const scaleFactor = newDiagLength / origDiagLength;
        const newPrimaryLength = primaryLength * scaleFactor;
        const newSecondaryLength = secondaryLength * scaleFactor;
        
        // Get the angle of the new diagonal
        const newDiagAngle = Math.atan2(newDiagonal.y, newDiagonal.x);
        
        // Get the original angle of the diagonal
        const origDiagAngle = Math.atan2(origDiagonal.y, origDiagonal.x);
        
        // Get the original angle of the primary edge
        const origPrimaryAngle = Math.atan2(primaryEdge.y, primaryEdge.x);
        
        // Calculate the offset angle between primary edge and diagonal
        let angleOffset = origPrimaryAngle - origDiagAngle;
        
        // New primary edge angle
        const newPrimaryAngle = newDiagAngle + angleOffset;
        
        // New primary edge vector
        const newPrimaryEdge = {
            x: Math.cos(newPrimaryAngle) * newPrimaryLength,
            y: Math.sin(newPrimaryAngle) * newPrimaryLength
        };
        
        // Calculate the original angle between primary and secondary edges
        const origSecondaryAngle = Math.atan2(secondaryEdge.y, secondaryEdge.x);
        const origAngleBetweenEdges = origSecondaryAngle - origPrimaryAngle;
        
        // New secondary edge angle maintains the same angle relationship
        const newSecondaryAngle = newPrimaryAngle + origAngleBetweenEdges;
        const newSecondaryEdge = {
            x: Math.cos(newSecondaryAngle) * newSecondaryLength,
            y: Math.sin(newSecondaryAngle) * newSecondaryLength
        };
        
        // Assign edges to correct vertices
        const newVertices = new Array(4);
        newVertices[anchorIndex] = anchor;
        
        if (primaryIndex === adj1Index) {
            newVertices[adj1Index] = {
                x: anchor.x + newPrimaryEdge.x,
                y: anchor.y + newPrimaryEdge.y
            };
            newVertices[adj2Index] = {
                x: anchor.x + newSecondaryEdge.x,
                y: anchor.y + newSecondaryEdge.y
            };
        } else {
            newVertices[adj2Index] = {
                x: anchor.x + newPrimaryEdge.x,
                y: anchor.y + newPrimaryEdge.y
            };
            newVertices[adj1Index] = {
                x: anchor.x + newSecondaryEdge.x,
                y: anchor.y + newSecondaryEdge.y
            };
        }
        
        // Dragged corner is at the sum of both edges
        newVertices[draggedIndex] = {
            x: anchor.x + newPrimaryEdge.x + newSecondaryEdge.x,
            y: anchor.y + newPrimaryEdge.y + newSecondaryEdge.y
        };
        
        return newVertices;
    }

    private startExistingLabelResize = (data: EditorData, labelId: string, anchorIndex: number) => {
        store.dispatch(updateActiveLabelId(labelId));
        this.resizeAnchorIndex = anchorIndex;
        EditorActions.setViewPortActionsDisabledStatus(true);
    };

    private endExistingLabelResize = (data: EditorData) => {
        const activeLabelOBB: LabelOBB = LabelsSelector.getActiveImageData().labelOBBs.find(
            (label: LabelOBB) => label.id === LabelsSelector.getActiveLabelId()
        );
        
        if (!!activeLabelOBB) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(
                data.mousePositionOnViewPortContent,
                data.viewPortContentImageRect
            );
            const imageData: ImageData = LabelsSelector.getActiveImageData();
            
            imageData.labelOBBs = imageData.labelOBBs.map((labelOBB: LabelOBB) => {
                if (labelOBB.id === activeLabelOBB.id) {
                    // Calculate new rectangle corners in viewport coordinates
                    const verticesOnCanvas = RenderEngineUtil.transferPolygonFromImageToViewPortContent(labelOBB.vertices, data);
                    const newVerticesOnCanvas = this.calculateRectangleCorners(verticesOnCanvas, this.resizeAnchorIndex, snappedMousePosition);
                    
                    // Transfer back to image coordinates
                    const newVertices = newVerticesOnCanvas.map((point: IPoint) => 
                        RenderEngineUtil.transferPointFromViewPortContentToImage(point, data)
                    );
                    
                    return {
                        ...labelOBB,
                        vertices: newVertices
                    };
                }
                return labelOBB;
            });
            
            store.dispatch(updateImageDataById(imageData.id, imageData));
        }
        
        this.resizeAnchorIndex = null;
        EditorActions.setViewPortActionsDisabledStatus(false);
    };

    private getEdgeUnderMouse(vertices: IPoint[], data: EditorData): number | null {
        const pathOnCanvas: IPoint[] = RenderEngineUtil.transferPolygonFromImageToViewPortContent(vertices, data);
        
        for (let i = 0; i < pathOnCanvas.length; i++) {
            const nextIndex = (i + 1) % pathOnCanvas.length;
            const edgeMidpoint = {
                x: (pathOnCanvas[i].x + pathOnCanvas[nextIndex].x) / 2,
                y: (pathOnCanvas[i].y + pathOnCanvas[nextIndex].y) / 2
            };
            
            if (this.isMouseOverAnchor(data.mousePositionOnViewPortContent, edgeMidpoint)) {
                return i;
            }
        }
        
        return null;
    }

    private startExistingLabelEdgeResize = (data: EditorData, labelId: string, edgeIndex: number) => {
        store.dispatch(updateActiveLabelId(labelId));
        this.resizeEdgeIndex = edgeIndex;
        EditorActions.setViewPortActionsDisabledStatus(true);
    };

    private endExistingLabelEdgeResize = (data: EditorData) => {
        const activeLabelOBB: LabelOBB = LabelsSelector.getActiveImageData().labelOBBs.find(
            (label: LabelOBB) => label.id === LabelsSelector.getActiveLabelId()
        );
        
        if (!!activeLabelOBB) {
            const snappedMousePosition: IPoint = RectUtil.snapPointToRect(
                data.mousePositionOnViewPortContent,
                data.viewPortContentImageRect
            );
            const imageData: ImageData = LabelsSelector.getActiveImageData();
            
            imageData.labelOBBs = imageData.labelOBBs.map((labelOBB: LabelOBB) => {
                if (labelOBB.id === activeLabelOBB.id) {
                    // Calculate new rectangle from edge drag in viewport coordinates
                    const verticesOnCanvas = RenderEngineUtil.transferPolygonFromImageToViewPortContent(labelOBB.vertices, data);
                    const newVerticesOnCanvas = this.calculateRectangleFromEdgeDrag(verticesOnCanvas, this.resizeEdgeIndex, snappedMousePosition);
                    
                    // Transfer back to image coordinates
                    const newVertices = newVerticesOnCanvas.map((point: IPoint) => 
                        RenderEngineUtil.transferPointFromViewPortContentToImage(point, data)
                    );
                    
                    return {
                        ...labelOBB,
                        vertices: newVertices
                    };
                }
                return labelOBB;
            });
            
            store.dispatch(updateImageDataById(imageData.id, imageData));
        }
        
        this.resizeEdgeIndex = null;
        EditorActions.setViewPortActionsDisabledStatus(false);
    };

    private calculateRectangleFromEdgeDrag(originalVertices: IPoint[], edgeIndex: number, mousePosition: IPoint): IPoint[] {
        // Edge is defined by edgeIndex and the next vertex
        const v1Index = edgeIndex;
        const v2Index = (edgeIndex + 1) % 4;
        const v3Index = (edgeIndex + 2) % 4;
        const v4Index = (edgeIndex + 3) % 4;
        
        // The dragged edge is v1->v2, opposite edge is v3->v4
        const v1 = originalVertices[v1Index];
        const v2 = originalVertices[v2Index];
        const v3 = originalVertices[v3Index];
        const v4 = originalVertices[v4Index];
        
        // Edge direction (normalized)
        const edgeVector = PointUtil.subtract(v2, v1);
        const edgeLength = Math.sqrt(edgeVector.x * edgeVector.x + edgeVector.y * edgeVector.y);
        
        if (edgeLength === 0) {
            return originalVertices;
        }
        
        const edgeDir = { x: edgeVector.x / edgeLength, y: edgeVector.y / edgeLength };
        
        // Perpendicular to edge (pointing inward toward rectangle)
        const perpendicular = { x: -edgeDir.y, y: edgeDir.x };
        
        // Determine which perpendicular direction points into the rectangle
        const toOppositeEdge = PointUtil.subtract(v3, v1);
        const perpDot = toOppositeEdge.x * perpendicular.x + toOppositeEdge.y * perpendicular.y;
        
        if (perpDot < 0) {
            perpendicular.x = -perpendicular.x;
            perpendicular.y = -perpendicular.y;
        }
        
        // Project mouse position onto the perpendicular direction from the edge
        const toMouse = PointUtil.subtract(mousePosition, v1);
        const perpDistance = toMouse.x * perpendicular.x + toMouse.y * perpendicular.y;
        
        // Translate the dragged edge
        const offset = { x: perpendicular.x * perpDistance, y: perpendicular.y * perpDistance };
        
        const newV1 = { x: v1.x + offset.x, y: v1.y + offset.y };
        const newV2 = { x: v2.x + offset.x, y: v2.y + offset.y };
        
        // Opposite edge stays in place
        const newVertices = new Array(4);
        newVertices[v1Index] = newV1;
        newVertices[v2Index] = newV2;
        newVertices[v3Index] = v3;
        newVertices[v4Index] = v4;
        
        return newVertices;
    }
}
