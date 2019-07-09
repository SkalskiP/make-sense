import React from 'react';
import './Editor.scss';
import {ISize} from "../../../interfaces/ISize";
import {ImageData} from "../../../store/editor/types";
import {FileUtils} from "../../../utils/FileUtils";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateImageDataById} from "../../../store/editor/actionCreators";
import {IRect} from "../../../interfaces/IRect";
import {RectUtil} from "../../../utils/RectUtil";
import {ImageRepository} from "../../../logic/ImageRepository";
import {IPoint} from "../../../interfaces/IPoint";
import {EditorCanvasRenderHelper} from "../../../logic/EditorCanvasRenderHelper";

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
}

interface IState {
    image: HTMLImageElement;
    mousePositionImageScale: IPoint;
    mousePositionCanvasScale: IPoint;
}

class Editor extends React.Component<IProps, IState> {
    private imageCanvas:HTMLCanvasElement;
    private baseRenderEngine: EditorCanvasRenderHelper;

    constructor(props) {
        super(props);

        this.state = {
            image: null,
            mousePositionImageScale: null,
            mousePositionCanvasScale: null,
        }
    }

    public componentDidMount(): void {
        this.loadImage(this.props.imageData);
        this.updateCanvasSize(this.props.size);
        this.baseRenderEngine = new EditorCanvasRenderHelper(this.imageCanvas);
        this.drawImage()
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            this.loadImage(this.props.imageData);
        }
        this.updateCanvasSize(this.props.size);
        this.drawImage()
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
        this.setState({image});
    };

    private mouseMoveHandler = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const image = this.state.image;
        const imageCanvasRect = this.imageCanvas.getBoundingClientRect();

        if (!image) return;

        const imageRect: IRect = this.baseRenderEngine.getImageRect();
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

    private handleLoadImageError = () => {};

    private updateCanvasSize = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!this.imageCanvas) {
            this.imageCanvas.width = newCanvasSize.width;
            this.imageCanvas.height = newCanvasSize.height;
        }
    };

    private drawImage = () => {
        if (!!this.state.image) {
            this.baseRenderEngine.updateImageRect(this.state.image);
            this.baseRenderEngine.drawImage(this.state.image);
            this.baseRenderEngine.drawCrossHair(this.state.mousePositionCanvasScale);
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

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);