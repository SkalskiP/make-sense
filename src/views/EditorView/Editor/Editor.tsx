import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";
import {ImageData} from "../../../store/editor/types";
import {FileUtil} from "../../../utils/FileUtil";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateImageDataById} from "../../../store/editor/actionCreators";
import {IRect} from "../../../interfaces/IRect";
import {ImageRepository} from "../../../logic/imageRepository/ImageRepository";
import {PrimaryEditorRenderEngine} from "../../../logic/render/PrimaryEditorRenderEngine";
import {LabelType} from "../../../data/LabelType";
import {RectRenderEngine} from "../../../logic/render/RectRenderEngine";
import {RectUtil} from "../../../utils/RectUtil";
import {Settings} from "../../../settings/Settings";
import {DrawUtil} from "../../../utils/DrawUtil";
import {IPoint} from "../../../interfaces/IPoint";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {CanvasUtil} from "../../../utils/CanvasUtil";
import {PointRenderEngine} from "../../../logic/render/PointRenderEngine";
import {CustomCursorStyle} from "../../../data/CustomCursorStyle";
import classNames from "classnames";
import {PolygonRenderEngine} from "../../../logic/render/PolygonRenderEngine";
import {ImageLoadManager} from "../../../logic/imageRepository/ImageLoadManager";
import {EventType} from "../../../data/EventType";
import {EditorData} from "../../../data/EditorData";
import {BaseRenderEngine} from "../../../logic/render/BaseRenderEngine";
import {ContextManager} from "../../../logic/context/ContextManager";
import {Context} from "../../../data/Context";

interface IProps {
    size: ISize;
    imageData: ImageData;
    activeLabelType: LabelType;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activePopupType: PopupWindowType;
    activeLabelId: string;
    customCursorStyle: CustomCursorStyle;
}

interface IState {
    image: HTMLImageElement;
}

class Editor extends React.Component<IProps, IState> {
    private canvas: HTMLCanvasElement;
    private mousePositionIndicator: HTMLDivElement;
    private cursor: HTMLDivElement;
    private primaryRenderingEngine: PrimaryEditorRenderEngine;
    private supportRenderingEngine: BaseRenderEngine;
    private imageRectOnCanvas: IRect;
    private mousePositionOnCanvas: IPoint;
    private isLoading: boolean = false;

    constructor(props) {
        super(props);
        this.state = { image: null }
    }

    // =================================================================================================================
    // LIFE CYCLE
    // =================================================================================================================

    public componentDidMount(): void {
        window.addEventListener(EventType.MOUSE_MOVE, this.update);
        window.addEventListener(EventType.MOUSE_UP, this.update);
        this.canvas.addEventListener(EventType.MOUSE_DOWN, this.onMouseDown);

        const {imageData, size ,activeLabelType} = this.props;

        ImageLoadManager.addAndRun(this.loadImage(imageData));

        this.resizeCanvas(size);
        this.primaryRenderingEngine = new PrimaryEditorRenderEngine(this.canvas);
        this.mountSupportRenderingEngine(activeLabelType);
        this.fullCanvasRender();
    }

    public componentWillUnmount(): void {
        window.removeEventListener(EventType.MOUSE_MOVE, this.update);
        window.removeEventListener(EventType.MOUSE_UP, this.update);
        this.canvas.removeEventListener(EventType.MOUSE_DOWN, this.onMouseDown);
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            ImageLoadManager.addAndRun(this.loadImage(this.props.imageData));
        }
        if (prevProps.activeLabelType !== this.props.activeLabelType) {
            this.swapSupportRenderingEngine(this.props.activeLabelType)
        }
        this.resizeCanvas(this.props.size);
        this.calculateImageRect(this.state.image);
        this.fullCanvasRender();
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    private update = (event: MouseEvent) => {
        const editorData: EditorData = this.buildEditorData(event);
        this.mousePositionOnCanvas = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        this.primaryRenderingEngine.update(editorData);
        this.supportRenderingEngine && this.supportRenderingEngine.update(editorData);
        !this.props.activePopupType && this.updateMousePositionIndicator(event);
        this.fullCanvasRender();
    };

    private onMouseDown = (event: MouseEvent) => {
        this.register();
        this.update(event);
    };

    // =================================================================================================================
    // LOAD IMAGE
    // =================================================================================================================

    private loadImage = async (imageData: ImageData): Promise<any> => {
        if (imageData.loadStatus) {
            this.setState({image: ImageRepository.getById(imageData.id)})
        }
        else {
            if (!this.isLoading) {
                this.isLoading = true;
                const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
                FileUtil.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
            }
        }
    };

    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        this.setState({image});
        this.isLoading = false;
    };

    private handleLoadImageError = () => {};

    // =================================================================================================================
    // RENDERING
    // =================================================================================================================

    private fullCanvasRender() {
        DrawUtil.clearCanvas(this.canvas);
        this.primaryRenderingEngine.drawImage(this.state.image, this.imageRectOnCanvas);
        if (!this.props.activePopupType) {
            this.primaryRenderingEngine.render(this.buildEditorData());
            this.supportRenderingEngine && this.supportRenderingEngine.render(this.buildEditorData());
        }
    }

    private updateMousePositionIndicator = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | MouseEvent) => {
        const image = this.state.image;

        if (!image || !this.imageRectOnCanvas || !this.canvas) {
            this.mousePositionIndicator.style.display = "none";
            this.cursor.style.display = "none";
            return;
        }

        const mousePositionOnCanvas: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);
        const canvasRect: IRect = {x: 0, y: 0, ...CanvasUtil.getSize(this.canvas)};
        const isOverCanvas: boolean = RectUtil.isPointInside(canvasRect, mousePositionOnCanvas);

        if (!isOverCanvas) {
            this.mousePositionIndicator.style.display = "none";
            this.cursor.style.display = "none";
            return;
        }

        const isOverImage: boolean = RectUtil.isPointInside(this.imageRectOnCanvas, mousePositionOnCanvas);

        if (isOverImage) {
            const scale = image.width / this.imageRectOnCanvas.width;
            const x: number = Math.round((mousePositionOnCanvas.x - this.imageRectOnCanvas.x) * scale);
            const y: number = Math.round((mousePositionOnCanvas.y - this.imageRectOnCanvas.y) * scale);
            const text: string = "x: " + x + ", y: " + y;

            this.mousePositionIndicator.innerHTML = text;
            this.mousePositionIndicator.style.left = (mousePositionOnCanvas.x + 15) + "px";
            this.mousePositionIndicator.style.top = (mousePositionOnCanvas.y + 15) + "px";
            this.mousePositionIndicator.style.display = "block";
        } else {
            this.mousePositionIndicator.style.display = "none";
        }

        this.cursor.style.left = mousePositionOnCanvas.x + "px";
        this.cursor.style.top = mousePositionOnCanvas.y + "px";
        this.cursor.style.display = "block";
    };

    // =================================================================================================================
    // RENDERING ENGINES
    // =================================================================================================================

    private swapSupportRenderingEngine = (activeLabelType: LabelType) => {
        this.mountSupportRenderingEngine(activeLabelType);
    };

    private mountSupportRenderingEngine = (activeLabelType: LabelType) => {
        switch (activeLabelType) {
            case LabelType.RECTANGLE:
                this.supportRenderingEngine = new RectRenderEngine(this.canvas);
                break;
            case LabelType.POINT:
                this.supportRenderingEngine = new PointRenderEngine(this.canvas);
                break;
            case LabelType.POLYGON:
                this.supportRenderingEngine = new PolygonRenderEngine(this.canvas);
                break;
            default:
                this.supportRenderingEngine = null;
                break;
        }
    };

    // =================================================================================================================
    // CONTEXT
    // =================================================================================================================

    private register(): void {
        const triggerAction = (event: KeyboardEvent) => {
            const editorData: EditorData = this.buildEditorData(event);
            this.primaryRenderingEngine.update(editorData);
            this.supportRenderingEngine && this.supportRenderingEngine.update(editorData);
            this.fullCanvasRender();
        };

        ContextManager.switchCtx(Context.EDITOR, [
            {
                keyCombo: ["Enter"],
                action: triggerAction
            },
            {
                keyCombo: ["Escape"],
                action: triggerAction
            }
        ])
    }

    // =================================================================================================================
    // HELPER METHODS
    // =================================================================================================================

    private buildEditorData(event?: Event): EditorData {
        return {
            mousePositionOnCanvas: this.mousePositionOnCanvas,
            canvasSize: CanvasUtil.getSize(this.canvas),
            activeImageScale: this.getImageScale(),
            activeImageRectOnCanvas: this.imageRectOnCanvas,
            event: event
        }
    }

    protected getImageScale(): number | null {
        if (!this.state.image || !this.imageRectOnCanvas)
            return null;

        return this.state.image.width / this.imageRectOnCanvas.width;
    }

    private resizeCanvas = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!this.canvas) {
            this.canvas.width = newCanvasSize.width;
            this.canvas.height = newCanvasSize.height;
        }
    };

    private calculateImageRect = (image: HTMLImageElement) => {
        if (!!image) {
            const canvasPaddingWidth: number = Settings.CANVAS_PADDING_WIDTH_PX;
            const imageRect: IRect = { x: 0, y: 0, width: image.width, height: image.height};
            const canvasRect: IRect = {
                x: canvasPaddingWidth,
                y: canvasPaddingWidth,
                width: this.canvas.width - 2 * canvasPaddingWidth,
                height: this.canvas.height - 2 * canvasPaddingWidth
            };
            const imageRatio = RectUtil.getRatio(imageRect);
            const imageRectOnCanvas = RectUtil.fitInsideRectWithRatio(canvasRect, imageRatio);
            this.imageRectOnCanvas = imageRectOnCanvas;
        }
    };

    private getCursorStyle = () => {
        const cursorStyle = this.props.customCursorStyle;
        return classNames(
            "Cursor", {
                "move": cursorStyle === CustomCursorStyle.MOVE,
                "add": cursorStyle === CustomCursorStyle.ADD,
                "resize": cursorStyle === CustomCursorStyle.RESIZE,
                "close": cursorStyle === CustomCursorStyle.CLOSE,
                "cancel": cursorStyle === CustomCursorStyle.CANCEL,
            }
        );
    };

    private getIndicator = (): string => {
        switch (this.props.customCursorStyle) {
            case CustomCursorStyle.ADD:
                return "ico/plus.png";
            case CustomCursorStyle.RESIZE:
                return "ico/resize.png";
            case CustomCursorStyle.CLOSE:
                return "ico/close.png";
            case CustomCursorStyle.MOVE:
                return "ico/move.png";
            case CustomCursorStyle.CANCEL:
                return "ico/cancel.png";
            default:
                return null;
        }
    }

    public render() {
        return (
            <div className="Editor">
                <canvas
                    className="ImageCanvas"
                    ref={ref => this.canvas = ref}
                    draggable={false}
                    onContextMenu={(event: React.MouseEvent<HTMLCanvasElement>) => event.preventDefault()}
                />
                <div
                    className="MousePositionIndicator"
                    ref={ref => this.mousePositionIndicator = ref}
                    draggable={false}
                />
                <div
                    className={this.getCursorStyle()}
                    ref={ref => this.cursor = ref}
                    draggable={false}
                >
                    <img
                        draggable={false}
                        alt={"indicator"}
                        src={this.getIndicator()}
                    />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    updateImageDataById
};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.editor.activeLabelType,
    activePopupType: state.general.activePopupType,
    activeLabelId: state.editor.activeLabelId,
    customCursorStyle: state.general.customCursorStyle
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);