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
import {BaseSuportRenderEngine} from "../../../logic/render/BaseSuportRenderEngine";

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
    private supportRenderingEngine: BaseSuportRenderEngine;
    private imageRectOnCanvas: IRect;
    private isLoading: boolean = false;

    constructor(props) {
        super(props);
        this.state = { image: null }
    }

    // =================================================================================================================
    // LIFE CYCLE
    // =================================================================================================================

    public componentDidMount(): void {
        window.addEventListener("mousemove", this.mouseMoveEventBus);
        window.addEventListener("mouseup", this.mouseUpEventBus);
        this.canvas.addEventListener("mousedown", this.mouseDownEventBus);

        const {imageData, size ,activeLabelType} = this.props;

        ImageLoadManager.add(this.loadImage(imageData));

        this.resizeCanvas(size);
        this.primaryRenderingEngine = new PrimaryEditorRenderEngine(this.canvas, this.imageRectOnCanvas);
        this.mountSupportRenderingEngine(activeLabelType);
        this.fullCanvasRender();
        ImageLoadManager.run();
    }

    public componentWillUnmount(): void {
        window.removeEventListener("mousemove", this.mouseMoveEventBus);
        window.removeEventListener("mouseup", this.mouseUpEventBus);
        this.canvas.removeEventListener("mousedown", this.mouseDownEventBus);
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            ImageLoadManager.add(this.loadImage(this.props.imageData));
        }
        if (prevProps.activeLabelType !== this.props.activeLabelType) {
            this.swapSupportRenderingEngine(this.props.activeLabelType)
        }
        this.resizeCanvas(this.props.size);
        this.calculateImageRect(this.state.image);
        this.fullCanvasRender();
        ImageLoadManager.run();
    }

    // =================================================================================================================
    // EVENT HANDLERS
    // =================================================================================================================

    private mouseMoveEventBus = (event: MouseEvent) => {
        this.primaryRenderingEngine.mouseMoveHandler(event);
        this.supportRenderingEngine && this.supportRenderingEngine.mouseMoveHandler(event);
        !this.props.activePopupType && this.updateMousePositionIndicator(event);
        this.fullCanvasRender();
    };

    private mouseDownEventBus = (event: MouseEvent) => {
        this.primaryRenderingEngine.mouseDownHandler(event);
        this.supportRenderingEngine && this.supportRenderingEngine.mouseDownHandler(event);
        !this.props.activePopupType && this.updateMousePositionIndicator(event);
        this.fullCanvasRender();
    };

    private mouseUpEventBus = (event: MouseEvent) => {
        this.primaryRenderingEngine.mouseUpHandler(event);
        this.supportRenderingEngine && this.supportRenderingEngine.mouseUpHandler(event);
        !this.props.activePopupType && this.updateMousePositionIndicator(event);
        this.fullCanvasRender();
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
        this.primaryRenderingEngine.drawImage(this.state.image);
        if (!this.props.activePopupType) {
            this.primaryRenderingEngine.render();
            this.supportRenderingEngine && this.supportRenderingEngine.render();
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
                this.supportRenderingEngine = new RectRenderEngine(this.canvas, this.imageRectOnCanvas);
                break;
            case LabelType.POINT:
                this.supportRenderingEngine = new PointRenderEngine(this.canvas, this.imageRectOnCanvas);
                break;
            case LabelType.POLYGON:
                this.supportRenderingEngine = new PolygonRenderEngine(this.canvas, this.imageRectOnCanvas);
                break;
            default:
                this.supportRenderingEngine = null;
                break;
        }
    };

    // =================================================================================================================
    // HELPER METHODS
    // =================================================================================================================

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

            this.primaryRenderingEngine.updateImageRect(imageRectOnCanvas);
            this.supportRenderingEngine && this.supportRenderingEngine.updateImageRect(imageRectOnCanvas);
            this.imageRectOnCanvas = imageRectOnCanvas;
        }
    };

    private getCursorStyle = () => {
        return classNames(
            "Cursor", {
                "move": this.props.customCursorStyle === CustomCursorStyle.MOVE
            }
        );
    };

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
                />
                <div
                    className={this.getCursorStyle()}
                    ref={ref => this.cursor = ref}
                />
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