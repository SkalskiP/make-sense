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

interface IProps {
    size: ISize,
    imageData: ImageData,
    updateImageDataById: (id: string, newImageData: ImageData) => any
}

interface IState {
    image: HTMLImageElement;
}

class Editor extends React.Component<IProps, IState> {
    private imageCanvas:HTMLCanvasElement;

    constructor(props) {
        super(props);

        this.state = {
            image: null
        }
    }

    public componentDidMount(): void {
        FileUtils.loadImage(this.props.imageData.fileData, this.saveLoadedImage, this.handleLoadImageError);
        this.resizeEditor(this.props.size);
        this.drawImage(this.props.size)
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        this.resizeEditor(this.props.size);
        this.drawImage(this.props.size)
    }

    private saveLoadedImage = (image: HTMLImageElement) => {
        this.setState({image});
    };

    private handleLoadImageError = () => {
        console.log("error");
    };

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
            ctx.drawImage(this.state.image, imageOnCanvasRect.x, imageOnCanvasRect.y, imageOnCanvasRect.width, imageOnCanvasRect.height);
        }
    };

    public render() {
        return (
            <div className="Editor">
                <canvas className="ImageCanvas" ref={ref => this.imageCanvas = ref}/>
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