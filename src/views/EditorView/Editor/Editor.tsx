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
import {DrawUtil} from "../../../utils/DrawUtil";
import {Settings} from "../../../settings/Settings";

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
        this.loadImage(this.props.imageData);
        this.resizeEditor(this.props.size);
        this.drawImage(this.props.size)
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        if (prevProps.imageData.id !== this.props.imageData.id) {
            this.loadImage(this.props.imageData);
        }
        this.resizeEditor(this.props.size);
        this.drawImage(this.props.size)
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

        if (!image || !this.imageRect)
            return;

        const scale = image.width / this.imageRect.width;
        const x: number = Math.round((event.clientX - imageCanvasRect.left - this.imageRect.x) * scale);
        const y: number = Math.round((event.clientY - imageCanvasRect.top - this.imageRect.y) * scale);

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

    private resizeEditor = (newCanvasSize: ISize) => {
        if (!!newCanvasSize && !!this.imageCanvas) {
            this.imageCanvas.width = newCanvasSize.width;
            this.imageCanvas.height = newCanvasSize.height;
        }
    };

    private drawImage = (canvasSize: ISize) => {
        if (!!this.state.image) {
            const ctx = this.imageCanvas.getContext("2d");
            const imageRect: IRect = { x: 0, y: 0, width: this.state.image.width, height: this.state.image.height}
            const canvasRect: IRect = {x: 10, y: 10, width: canvasSize.width - 20, height: canvasSize.height - 20}
            const imageRatio = RectUtil.getRatio(imageRect);
            const imageOnCanvasRect: IRect = RectUtil.fitInsideRectWithRatio(canvasRect, imageRatio);
            this.imageRect = imageOnCanvasRect;
            ctx.drawImage(this.state.image, imageOnCanvasRect.x, imageOnCanvasRect.y, imageOnCanvasRect.width, imageOnCanvasRect.height);

            const mousePosition = this.state.mousePositionCanvasScale;
            if (!!mousePosition) {
                const horizontalStart = {
                    x: 0,
                    y: Math.floor(mousePosition.y) + 0.5
                };
                const horizontalEnd = {
                    x: this.imageCanvas.width,
                    y: mousePosition.y
                };

                DrawUtil.drawLine(this.imageCanvas, horizontalStart, horizontalEnd, Settings.SECONDARY_COLOR, 1)

                const verticalStart = {
                    x: Math.floor(mousePosition.x) + 0.5,
                    y: 0
                };
                const verticalEnd = {
                    x: mousePosition.x,
                    y: this.imageCanvas.height
                };

                DrawUtil.drawLine(this.imageCanvas, verticalStart, verticalEnd, Settings.SECONDARY_COLOR, 1)

            }
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