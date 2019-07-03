import React from 'react';
import './ImagePreview.scss';
import {ImageData} from "../../../../store/editor/types";
import {ClipLoader} from "react-spinners";
import {Settings} from "../../../../settings/Settings";
import {ImageRepository} from "../../../../logic/ImageRepository";
import {updateImageDataById} from "../../../../store/editor/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import {FileUtils} from "../../../../utils/FileUtils";
import classNames from "classnames";

interface IProps {
    imageData: ImageData;
    style: React.CSSProperties;
    showLoader?: boolean;
    onClick?: () => any;
    isSelected?: boolean;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
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
        this.loadImage(this.props.imageData);
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
        return(
            <div
                className={this.getClassName()}
                style={this.props.style}
                onClick={this.props.onClick ? this.props.onClick : undefined}
            >
                {(!!this.state.image && !this.props.showLoader) ?
                <img src={this.state.image.src}/> :
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

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagePreview);