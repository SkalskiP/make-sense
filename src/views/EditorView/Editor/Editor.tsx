import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";
import {ImageData} from "../../../store/editor/types";
import {FileUtils} from "../../../utils/FileUtils";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateImageDataById} from "../../../store/editor/actionCreators";
import {IRect} from "../../../interfaces/IRect";
import {ImageRepository} from "../../../logic/ImageRepository";
import {IPoint} from "../../../interfaces/IPoint";
import {EditorCanvasRenderHelper} from "../../../logic/EditorCanvasRenderHelper";
import {LabelType} from "../../../data/LabelType";
import {RectRenderHelper} from "../../../logic/RectRenderHelper";
import {RectUtil} from "../../../utils/RectUtil";
import {Settings} from "../../../settings/Settings";

interface IProps {
    size: ISize;
    imageData: ImageData;
    activeLabelType: LabelType;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
}

interface IState {
    image: HTMLImageElement;
    mousePositionImageScale: IPoint;
    mousePositionCanvasScale: IPoint;
}

class Editor extends React.Component<IProps, IState> {
    private imageCanvas:HTMLCanvasElement;
    private baseRenderingEngine: EditorCanvasRenderHelper;
    private supportRenderingEngine: any;
    private imageRect: IRect;

    constructor(props) {
        super(props);

        this.state = {
            image: null,
            mousePositionImageScale: null,
            mousePositionCanvasScale: null,
        }
    }

    public componentDidMount(): void {
        const {imageData, size ,activeLabelType} = this.props;
        this.loadImage(imageData);
        this.updateCanvasSize(size);
        this.baseRenderingEngine = new EditorCanvasRenderHelper(this.imageCanvas);
        this.mountSupportRenderingEngine(activeLabelType);
        this.drawImage()
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            this.loadImage(this.props.imageData);
        }
        if (prevProps.activeLabelType !== this.props.activeLabelType) {
            this.switchSupportRenderingEngine(this.props.activeLabelType)
        }
        this.updateCanvasSize(this.props.size);
        this.updateImageRect(this.state.image);
        this.drawImage();
    }

    private loadImage = (imageData: ImageData) => {
        if (imageData.loadStatus) {
            this.setState({image: ImageRepository.getById(imageData.id)})
        }
        else {
            const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
            FileUtils.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
        }
    };

    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        this.updateImageRect(image);
        this.setState({image});
    };

    private switchSupportRenderingEngine = (activeLabelType: LabelType) => {
        if (!!this.supportRenderingEngine) {
            this.supportRenderingEngine.unmount();
        }
        this.mountSupportRenderingEngine(activeLabelType);
    };

    private mountSupportRenderingEngine = (activeLabelType: LabelType) => {
        switch (activeLabelType) {
            case LabelType.RECTANGLE:
                this.supportRenderingEngine = new RectRenderHelper(this.imageCanvas, this.imageRect);
                break;
            default:
                this.supportRenderingEngine = null;
                break;
        }
    };

    private mouseMoveHandler = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const image = this.state.image;
        const imageCanvasRect = this.imageCanvas.getBoundingClientRect();

        if (!image) return;

        const imageRect: IRect = this.baseRenderingEngine.getImageRect();
        const scale = image.width / imageRect.width;
        const x: number = Math.round((event.clientX - imageCanvasRect.left - imageRect.x) * scale);
        const y: number = Math.round((event.clientY - imageCanvasRect.top - imageRect.y) * scale);

        if (x >= 0 && x <= image.width && y >= 0 && y <= image.height) {
            this.setState({
                mousePositionImageScale: {x, y},
                mousePositionCanvasScale: {
                    x: event.clientX - imageCanvasRect.left,
                    y: event.clientY - imageCanvasRect.top
                }
            });
            this.imageCanvas.style.cursor = "crosshair";
        } else {
            this.setState({
                mousePositionImageScale: null,
                mousePositionCanvasScale: null,
            });
            this.imageCanvas.style.cursor = "default";
        }
    };

    private mouseLeaveHandler = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        this.setState({
            mousePositionImageScale: null,
            mousePositionCanvasScale: null,
        });
    };

    private handleLoadImageError = () => {};

    private updateCanvasSize = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!this.imageCanvas) {
            this.imageCanvas.width = newCanvasSize.width;
            this.imageCanvas.height = newCanvasSize.height;
        }
    };

    private drawImage = () => {
        if (!!this.state.image) {
            this.baseRenderingEngine.drawImage(this.state.image);
            this.supportRenderingEngine && this.supportRenderingEngine.render();
            this.baseRenderingEngine.drawCrossHair(this.state.mousePositionCanvasScale);
            console.log("drawImage")
        }
    };

    private updateImageRect = (image: HTMLImageElement) => {
        if (!!image) {
            const canvasPaddingWidth: number = Settings.CANVAS_PADDING_WIDTH;
            const imageRect: IRect = { x: 0, y: 0, width: image.width, height: image.height};
            const canvasRect: IRect = {
                x: canvasPaddingWidth,
                y: canvasPaddingWidth,
                width: this.imageCanvas.width - 2 * canvasPaddingWidth,
                height: this.imageCanvas.height - 2 * canvasPaddingWidth
            };
            const imageRatio = RectUtil.getRatio(imageRect);
            const imageRectOnCanvas = RectUtil.fitInsideRectWithRatio(canvasRect, imageRatio);

            this.baseRenderingEngine.updateImageRect(imageRectOnCanvas);
            this.supportRenderingEngine && this.supportRenderingEngine.updateImageRect(imageRectOnCanvas);
            this.imageRect = imageRectOnCanvas;
        }
    };

    private getMousePositionRender = () => {
        const { mousePositionImageScale } = this.state;
        if (mousePositionImageScale) {
            return(
                <div
                    className="MousePosition"
                    style={{
                        top: this.state.mousePositionCanvasScale.y + 10,
                        left: this.state.mousePositionCanvasScale.x + 10
                    }}

                >
                    {"x: " + mousePositionImageScale.x + ", y: " + mousePositionImageScale.y}
                </div>
            )
        } else {
            return null;
        }
    };

    public render() {
        return (
            <div className="Editor">
                <canvas
                    className="ImageCanvas"
                    onMouseMove={this.mouseMoveHandler}
                    onMouseLeave={this.mouseLeaveHandler}
                    ref={ref => this.imageCanvas = ref}
                />
                {this.getMousePositionRender()}
            </div>
        );
    }
}

const mapDispatchToProps = {
    updateImageDataById
};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.editor.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);