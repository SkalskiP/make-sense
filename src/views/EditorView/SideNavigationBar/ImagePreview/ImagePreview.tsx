import React from 'react';
import './ImagePreview.scss';
import {ImageData} from "../../../../store/editor/types";
import {ClipLoader} from "react-spinners";
import {Settings} from "../../../../settings/Settings";
import {ImageRepository} from "../../../../logic/imageRepository/ImageRepository";
import {updateImageDataById} from "../../../../store/editor/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {FileUtil} from "../../../../utils/FileUtil";
import classNames from "classnames";
import {ISize} from "../../../../interfaces/ISize";
import {RectUtil} from "../../../../utils/RectUtil";
import {IRect} from "../../../../interfaces/IRect";
import {LabelType} from "../../../../data/LabelType";

interface IProps {
    imageData: ImageData;
    style: React.CSSProperties;
    size: ISize;
    isScrolling?: boolean;
    onClick?: () => any;
    isSelected?: boolean;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activeLabelType: LabelType;
}

interface IState {
    image: HTMLImageElement;
}

class ImagePreview extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
        }
    }

    public componentDidMount(): void {
        this.loadImage(this.props.imageData, this.props.isScrolling);
    }

    public componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): void {
        if (this.props.imageData.id !== nextProps.imageData.id) {
            if (nextProps.imageData.loadStatus) {
                this.loadImage(nextProps.imageData, nextProps.isScrolling);
            }
            else {
                this.setState({image: null});
            }
        }

        if (this.props.isScrolling && !nextProps.isScrolling) {
            this.loadImage(nextProps.imageData, false);
        }
    }

    private loadImage = (imageData: ImageData, isScrolling: boolean) => {
        if (imageData.loadStatus) {
            const image = ImageRepository.getById(imageData.id);
            this.setState({image});
        }
        else if (!isScrolling) {
            const saveLoadedImagePartial = (image: HTMLImageElement) => this.saveLoadedImage(image, imageData);
            FileUtil.loadImage(imageData.fileData, saveLoadedImagePartial, this.handleLoadImageError);
        }
    };

    private saveLoadedImage = (image: HTMLImageElement, imageData: ImageData) => {
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.store(imageData.id, image);
        if (imageData.id === this.props.imageData.id) {
            this.setState({image});
        }
    };

    private getStyle = () => {
        const { size } = this.props;

        const containerRect: IRect = {
            x: 0.15 * size.width,
            y: 0.15 * size.height,
            width: 0.7 * size.width,
            height: 0.7 * size.height
        };

        const imageRect:IRect = {
            x: 0,
            y: 0,
            width: this.state.image.width,
            height: this.state.image.height
        };

        const imageRatio = RectUtil.getRatio(imageRect);
        const imagePosition: IRect = RectUtil.fitInsideRectWithRatio(containerRect, imageRatio);

        return {
            width: imagePosition.width,
            height: imagePosition.height,
            left: imagePosition.x,
            top: imagePosition.y
        }
    };

    private handleLoadImageError = () => {};

    private getClassName = () => {
        return classNames(
            "ImagePreview",
            {
                "selected": this.props.isSelected,
            }
        );
    };

    public render() {
        const {
            activeLabelType,
            imageData,
            style,
            onClick
        } = this.props;

        const isChecked: boolean =
            activeLabelType === LabelType.RECTANGLE && imageData.labelRects.length > 0 ||
            activeLabelType === LabelType.POINT && imageData.labelPoints.length > 0;

        return(
            <div
                className={this.getClassName()}
                style={style}
                onClick={onClick ? onClick : undefined}
            >
                {(!!this.state.image) ?
                [
                    <div
                        className="Foreground"
                        key={"Foreground"}
                        style={this.getStyle()}
                    >
                        <img
                            className="Image"
                            draggable={false}
                            src={this.state.image.src}
                            alt={this.state.image.alt}
                            style={{...this.getStyle(), left: 0, top: 0}}
                        />
                        {isChecked && <img
                            className="CheckBox"
                            draggable={false}
                            src={"ico/checkbox-checked-color.png"}
                            alt={"checkbox"}
                        />}
                    </div>,
                    <div
                        className="Background"
                        key={"Background"}
                        style={this.getStyle()}
                    />
                ] :
                <ClipLoader
                    sizeUnit={"px"}
                    size={30}
                    color={Settings.SECONDARY_COLOR}
                    loading={true}
                />}
            </div>)
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
)(ImagePreview);