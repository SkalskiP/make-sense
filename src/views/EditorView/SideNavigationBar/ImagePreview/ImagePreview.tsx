import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import {ClipLoader} from 'react-spinners';
import {ImageLoadManager} from '../../../../logic/imageRepository/ImageLoadManager';
import {IRect} from '../../../../interfaces/IRect';
import {ISize} from '../../../../interfaces/ISize';
import {ImageRepository} from '../../../../logic/imageRepository/ImageRepository';
import {AppState} from '../../../../store';
import {updateImageDataById} from '../../../../store/labels/actionCreators';
import {ImageData} from '../../../../store/labels/types';
import {FileUtil} from '../../../../utils/FileUtil';
import {RectUtil} from '../../../../utils/RectUtil';
import './ImagePreview.scss';
import {CSSHelper} from '../../../../logic/helpers/CSSHelper';
import {URIUtil} from '../../../../utils/URIUtil';

interface IProps {
    imageData: ImageData;
    style: React.CSSProperties;
    size: ISize;
    isScrolling?: boolean;
    isChecked?: boolean;
    onClick?: () => any;
    isSelected?: boolean;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
}

interface IState {
    image: HTMLImageElement;
}

class ImagePreview extends React.Component<IProps, IState> {
    private isLoading: boolean = false;

    constructor(props) {
        super(props);

        this.state = {
            image: null
        };
    }

    public componentDidMount(): void {
        ImageLoadManager.addAndRun(
            this.loadAPIImage(this.props.imageData, this.props.isScrolling)
        );
    }

    public componentWillUpdate(
        nextProps: Readonly<IProps>,
        nextState: Readonly<IState>,
        nextContext: any
    ): void {
        if (this.props.imageData.id !== nextProps.imageData.id) {
            if (nextProps.imageData.loadStatus) {
                ImageLoadManager.addAndRun(
                    this.loadAPIImage(
                        nextProps.imageData,
                        nextProps.isScrolling
                    )
                );
            } else {
                this.setState({image: null});
            }
        }

        if (this.props.isScrolling && !nextProps.isScrolling) {
            ImageLoadManager.addAndRun(
                this.loadAPIImage(nextProps.imageData, false)
            );
        }
    }

    shouldComponentUpdate(
        nextProps: Readonly<IProps>,
        nextState: Readonly<IState>,
        nextContext: any
    ): boolean {
        return (
            this.props.imageData.id !== nextProps.imageData.id ||
            this.state.image !== nextState.image ||
            this.props.isSelected !== nextProps.isSelected ||
            this.props.isChecked !== nextProps.isChecked || 
            this.props.imageData.image_status !== nextProps.imageData.image_status 
        );
    }

    private loadImage = async (imageData: ImageData, isScrolling: boolean) => {
        if (imageData.loadStatus) {
            const image = ImageRepository.getById(imageData.id);
            if (this.state.image !== image) {
                this.setState({image});
            }
        } else if (!isScrolling || !this.isLoading) {
            this.isLoading = true;
            const saveLoadedImagePartial = (image: HTMLImageElement) =>
                this.saveLoadedImage(image, imageData);
            FileUtil.loadImage(imageData.fileData)
                .then((image: HTMLImageElement) =>
                    saveLoadedImagePartial(image)
                )
                .catch((error) => this.handleLoadImageError());
        }
    };
    private loadAPIImage = async (
        imageData: ImageData,
        isScrolling: boolean
    ) => {
        if (imageData.loadStatus) {
            const image = ImageRepository.getById(imageData.id);
            if (this.state.image !== image) {
                this.setState({image});
            }
        } else if (!isScrolling || !this.isLoading) {
            this.isLoading = true;
            const saveLoadedImagePartial = (image: HTMLImageElement) =>
                this.saveLoadedImage(image, imageData);
            //@ts-ignore
            URIUtil.loadImage(imageData.fileData.path)
                .then((image: HTMLImageElement) =>
                    saveLoadedImagePartial(image)
                )
                .catch((error) => this.handleLoadImageError());
        }
    };

    private saveLoadedImage = (
        image: HTMLImageElement,
        imageData: ImageData
    ) => {
        // console.log('saveLoadedImage: ', image, imageData);
        imageData.loadStatus = true;
        this.props.updateImageDataById(imageData.id, imageData);
        ImageRepository.storeImage(imageData.id, image);
        if (imageData.id === this.props.imageData.id) {
            this.setState({image});
            this.isLoading = false;
        }
    };

    private getStyle = () => {
        const {size} = this.props;

        const containerRect: IRect = {
            x: 0.05 * size.width,
            y: 0.05 * size.height,
            width: 0.8 * size.width,
            height: 0.8 * size.height
        };

        const imageRect: IRect = {
            x: 0,
            y: 0,
            width: this.state.image.width,
            height: this.state.image.height
        };

        const imageRatio = RectUtil.getRatio(imageRect);
        const imagePosition: IRect = RectUtil.fitInsideRectWithRatio(
            containerRect,
            imageRatio
        );

        return {
            width: imagePosition.width,
            height: imagePosition.height,
            left: imagePosition.x,
            top: imagePosition.y
        };
    };

    private handleLoadImageError = () => {};

    private getClassName = () => {
        return classNames('ImagePreview', {
            selected: this.props.isSelected
        });
    };

    public render() {
        const {isChecked, style, onClick, imageData} = this.props; 
        return (
            <div
                className={this.getClassName()}
                style={style}
                onClick={onClick ? onClick : undefined}>
                {!!this.state.image ? (
                    [
                        <div
                            className={`Foreground  ${imageData?.image_status === 'R' ? "danger": ""}`}
                            key={'Foreground'}
                            style={this.getStyle()}>
                            
                                <img
                                    className="Image"
                                    draggable={false}
                                    src={this.state.image.src}
                                    alt={this.state.image.alt}
                                    style={{...this.getStyle(), left: 0, top: 0}}
                                />
                                {isChecked && (
                                    <img
                                        className="CheckBox"
                                        draggable={false}
                                        src={'ico/ok.png'}
                                        alt={'checkbox'}
                                    />
                                )}
                      
                        </div>,
                        <div
                            className={`Background ${imageData?.image_status === 'R' ? "danger": ""}`}
                            key={'Background'}
                            style={this.getStyle()}
                        />
                    ]
                ) : (
                    <ClipLoader
                        size={30}
                        color={CSSHelper.getLeadingColor()}
                        loading={true}
                    />
                )}
            </div>
        );
    }
}

const mapDispatchToProps = {
    updateImageDataById
};

const mapStateToProps = (state: AppState) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ImagePreview);
