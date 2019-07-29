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
import {BaseRenderEngine} from "../../../logic/render/BaseRenderEngine";

interface IProps {
    size: ISize;
    imageData: ImageData;
    activeLabelType: LabelType;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activePopupType: PopupWindowType;
    activeLabelId: string;
}

interface IState {
    image: HTMLImageElement;
}

class Editor extends React.Component<IProps, IState> {
    private canvas: HTMLCanvasElement;
    private mousePositionIndicator: HTMLDivElement;
    private primaryRenderingEngine: PrimaryEditorRenderEngine;
    private supportRenderingEngine: BaseRenderEngine;
    private imageRectOnCanvas: IRect;

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
        this.loadImage(imageData);
        this.resizeCanvas(size);
        this.primaryRenderingEngine = new PrimaryEditorRenderEngine(this.canvas, this.imageRectOnCanvas);
        this.mountSupportRenderingEngine(activeLabelType);
        this.fullCanvasRender()
    }

    public componentWillUnmount(): void {
        window.removeEventListener("mousemove", this.mouseMoveEventBus);
        window.removeEventListener("mouseup", this.mouseUpEventBus);
        this.canvas.removeEventListener("mousedown", this.mouseDownEventBus);
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            this.loadImage(this.props.imageData);
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

    private loadImage = (imageData: ImageData) => {
        if (imageData.loadStatus) {
            this.setState({image: ImageRepository.getById(imageData.id)})
        }
        else {
            const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
            FileUtil.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
        }
    };

    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        this.setState({image});
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
        const mousePositionOnCanvas: IPoint = CanvasUtil.getMousePositionOnCanvasFromEvent(event, this.canvas);

        if (!image || !this.imageRectOnCanvas || !RectUtil.isPointInside(this.imageRectOnCanvas, mousePositionOnCanvas)) {
            this.mousePositionIndicator.style.display = "none";
            return;
        }

        const scale = image.width / this.imageRectOnCanvas.width;
        const x: number = Math.round((mousePositionOnCanvas.x - this.imageRectOnCanvas.x) * scale);
        const y: number = Math.round((mousePositionOnCanvas.y - this.imageRectOnCanvas.y) * scale);
        const text: string = "x: " + x + ", y: " + y;

        this.mousePositionIndicator.innerHTML = text;
        this.mousePositionIndicator.style.left = (mousePositionOnCanvas.x + 10) + "px";
        this.mousePositionIndicator.style.top = (mousePositionOnCanvas.y + 10) + "px";
        this.mousePositionIndicator.style.display = "block";
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

    public render() {
        return (
            <div className="Editor">
                <canvas
                    className="ImageCanvas"
                    ref={ref => this.canvas = ref}
                />
                <div
                    className="MousePositionIndicator"
                    ref={ref => this.mousePositionIndicator = ref}
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
    activeLabelId: state.editor.activeLabelId
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);