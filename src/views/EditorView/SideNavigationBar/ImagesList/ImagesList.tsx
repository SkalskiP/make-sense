import React from 'react';
import {connect} from "react-redux";
import {LabelType} from "../../../../data/enums/LabelType";
import {ISize} from "../../../../interfaces/ISize";
import {AppState} from "../../../../store";
import {ImageData, LabelPoint, LabelRect} from "../../../../store/labels/types";
import {VirtualList} from "../../../Common/VirtualList/VirtualList";
import ImagePreview from "../ImagePreview/ImagePreview";
import './ImagesList.scss';
import {ContextManager} from "../../../../logic/context/ContextManager";
import {ContextType} from "../../../../data/enums/ContextType";
import {ImageActions} from "../../../../logic/actions/ImageActions";
import {EventType} from "../../../../data/enums/EventType";
import {LabelStatus} from "../../../../data/enums/LabelStatus";

interface IProps {
    activeImageIndex: number;
    imagesData: ImageData[];
    activeLabelType: LabelType;
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

    private isImageChecked = (index:number): boolean => {
        return (this.props.activeLabelType === LabelType.RECTANGLE &&
            this.props.imagesData[index].labelRects
                .filter((labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED).length > 0) ||
            (this.props.activeLabelType === LabelType.POINT &&
                this.props.imagesData[index].labelPoints
                    .filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED).length > 0) ||
            (this.props.activeLabelType === LabelType.POLYGON && this.props.imagesData[index].labelPolygons.length > 0) ||
            (this.props.activeLabelType === LabelType.LINE && this.props.imagesData[index].labelLines.length > 0)
    };

    private onClickHandler = (index: number) => {
        ImageActions.getImageByIndex(index)
    };

    private renderImagePreview = (index: number, isScrolling: boolean, isVisible: boolean, style: React.CSSProperties) => {
        return <ImagePreview
            key={index}
            style={style}
            size={{width: 150, height: 150}}
            isScrolling={isScrolling}
            isChecked={this.isImageChecked(index)}
            imageData={this.props.imagesData[index]}
            onClick={() => this.onClickHandler(index)}
            isSelected={this.props.activeImageIndex === index}
        />
    };

    public render() {
        const { size } = this.state;
        return(
            <div
                className="ImagesList"
                ref={ref => this.imagesListRef = ref}
                onClick={() => ContextManager.switchCtx(ContextType.LEFT_NAVBAR)}
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
    activeLabelType: state.labels.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesList);