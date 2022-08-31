import React from 'react';
import {connect} from 'react-redux';
import {LabelType} from '../../../../data/enums/LabelType';
import {ISize} from '../../../../interfaces/ISize';
import {AppState} from '../../../../store';
import {ImageData, LabelName, LabelPoint, LabelRect} from '../../../../store/labels/types';
import {VirtualList} from '../../../Common/VirtualList/VirtualList';
import ImagePreview from '../ImagePreview/ImagePreview';
import './ImagesList.scss';
import {ContextManager} from '../../../../logic/context/ContextManager';
import {ContextType} from '../../../../data/enums/ContextType';
import {ImageActions} from '../../../../logic/actions/ImageActions';
import {EventType} from '../../../../data/enums/EventType';
import {LabelStatus} from '../../../../data/enums/LabelStatus';

interface IProps {
    activeImageIndex: number;
    imagesData: ImageData[];
    activeLabelType: LabelType;
    labels: LabelName[];
}

interface IState {
    size: ISize;
}

class ImagesList extends React.Component<IProps, IState> {
    private imagesListRef: HTMLDivElement;

    constructor(props) {
        super(props);

        this.state = {
            size: null,
        }
    }

    public componentDidMount(): void {
        this.updateListSize();
        window.addEventListener(EventType.RESIZE, this.updateListSize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener(EventType.RESIZE, this.updateListSize);
    }

    private updateListSize = () => {
        if (!this.imagesListRef)
            return;

        const listBoundingBox = this.imagesListRef.getBoundingClientRect();
        this.setState({
            size: {
                width: listBoundingBox.width,
                height: listBoundingBox.height
            }
        })
    };

    private getAnnotationCount = (index:number): number => {
        const imageData = this.props.imagesData[index]
        switch (this.props.activeLabelType) {
            case LabelType.LINE:
                return imageData.labelLines.length
            case LabelType.IMAGE_RECOGNITION:
                return imageData.labelNameIds.length
            case LabelType.POINT:
                return imageData.labelPoints
                    .filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED)
                    .length
            case LabelType.POLYGON:
                return imageData.labelPolygons.length
            case LabelType.RECT:
                return imageData.labelRects
                    .filter((labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED)
                    .length
        }
    };

    private onClickHandler = (index: number): void => {
        ImageActions.getImageByIndex(index)
    };

    private renderImagePreview = (
        index: number,
        isScrolling: boolean,
        isVisible: boolean,
        style: React.CSSProperties
    ) => {
        const imagePreviewOnClickHandler = () => this.onClickHandler(index)
        return <ImagePreview
            key={index}
            style={style}
            size={{width: 150, height: 150}}
            isScrolling={isScrolling}
            annotationsCount={this.getAnnotationCount(index)}
            imageData={this.props.imagesData[index]}
            onClick={imagePreviewOnClickHandler}
            isSelected={this.props.activeImageIndex === index}
        />
    };

    public render() {
        const { size } = this.state;
        const imageListOnnClickHandler = () => ContextManager.switchCtx(ContextType.LEFT_NAVBAR)
        return(
            <div
                className='ImagesList'
                ref={ref => this.imagesListRef = ref}
                onClick={imageListOnnClickHandler}
            >
                {!!size && <VirtualList
                    size={size}
                    childSize={{width: 150, height: 150}}
                    childCount={this.props.imagesData.length}
                    childRender={this.renderImagePreview}
                    overScanHeight={200}
                />}
            </div>
        )
    }
}

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeImageIndex: state.labels.activeImageIndex,
    imagesData: state.labels.imagesData,
    activeLabelType: state.labels.activeLabelType,
    labels: state.labels.labels
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesList);
