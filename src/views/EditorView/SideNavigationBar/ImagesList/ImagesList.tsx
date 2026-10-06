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
import {isReviewedFile} from "../../../../logic/projects/learningMarks";
import {ImageFilter, imageFilterStatus, matchImageFilter} from "../../../../logic/review/reviewWorkflow";

interface IProps {
    activeImageIndex: number;
    imagesData: ImageData[];
    activeLabelType: LabelType;
}

interface IState {
    size: ISize;
    filter: ImageFilter;
    query: string;
}

type ImageEntry = { imageData: ImageData; realIndex: number };

class ImagesList extends React.Component<IProps, IState> {
    private imagesListRef: HTMLDivElement;
    private listBodyRef: HTMLDivElement;

    constructor(props) {
        super(props);

        this.state = {
            size: null,
            filter: 'all',
            query: '',
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
        if (!this.listBodyRef)
            return;

        const listBoundingBox = this.listBodyRef.getBoundingClientRect();
        this.setState({
            size: {
                width: listBoundingBox.width,
                height: listBoundingBox.height
            }
        })
    };

    private isImageChecked = (index:number): boolean => {
        const imageData = this.props.imagesData[index]
        switch (this.props.activeLabelType) {
            case LabelType.LINE:
                return imageData.labelLines.length > 0
            case LabelType.IMAGE_RECOGNITION:
                return imageData.labelNameIds.length > 0
            case LabelType.POINT:
                return imageData.labelPoints
                    .filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED)
                    .length > 0
            case LabelType.POLYGON:
                return imageData.labelPolygons.length > 0
            case LabelType.RECT:
                return imageData.labelRects
                    .filter((labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED)
                    .length > 0
        }
    };

    private getEntries = (): ImageEntry[] => {
        const { filter, query } = this.state;
        const entries: ImageEntry[] = [];
        this.props.imagesData.forEach((imageData, realIndex) => {
            const status = imageFilterStatus(
                isReviewedFile(imageData.fileData.name), imageData.labelRects.length > 0);
            if (matchImageFilter(status, filter, imageData.fileData.name, query)) {
                entries.push({ imageData, realIndex });
            }
        });
        return entries;
    };

    private countByStatus = () => {
        const counts = { todo: 0, review: 0, done: 0 };
        for (const imageData of this.props.imagesData) {
            counts[imageFilterStatus(
                isReviewedFile(imageData.fileData.name), imageData.labelRects.length > 0)]++;
        }
        return counts;
    };

    private onClickHandler = (realIndex: number) => {
        ImageActions.getImageByIndex(realIndex)
    };

    private renderImagePreview = (entries: ImageEntry[]) =>
        (index: number, isScrolling: boolean, isVisible: boolean, style: React.CSSProperties) => {
            const entry = entries[index];
            if (!entry) return null;
            const { imageData, realIndex } = entry;
            return <ImagePreview
                key={imageData.id}
                style={style}
                size={{width: 150, height: 150}}
                isScrolling={isScrolling}
                isChecked={this.isImageChecked(realIndex)}
                isReviewed={isReviewedFile(imageData.fileData.name)}
                imageData={imageData}
                onClick={() => this.onClickHandler(realIndex)}
                isSelected={this.props.activeImageIndex === realIndex}
            />
        };

    private renderFilterBar = (counts: { todo: number; review: number; done: number }) => {
        const { filter, query } = this.state;
        const filters: { id: ImageFilter; label: string }[] = [
            { id: 'all', label: `All ${this.props.imagesData.length}` },
            { id: 'todo', label: `Todo ${counts.todo}` },
            { id: 'review', label: `Review ${counts.review}` },
            { id: 'done', label: `Done ${counts.done}` },
        ];
        return (
            <div className="ImageFilterBar" onClick={e => e.stopPropagation()}>
                <div className="ImageFilterButtons" role="tablist" aria-label="Image status filter">
                    {filters.map(f => (
                        <button
                            key={f.id}
                            role="tab"
                            aria-selected={filter === f.id}
                            className={filter === f.id ? 'active' : ''}
                            onClick={() => this.setState({ filter: f.id })}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <input
                    aria-label="Search filename"
                    placeholder="Search filename…"
                    value={query}
                    onChange={e => this.setState({ query: e.target.value })}
                />
            </div>
        );
    };

    public render() {
        const { size } = this.state;
        const entries = this.getEntries();
        return(
            <div
                className="ImagesList"
                ref={ref => this.imagesListRef = ref}
                onClick={() => ContextManager.switchCtx(ContextType.LEFT_NAVBAR)}
            >
                {this.renderFilterBar(this.countByStatus())}
                <div
                    className="ImageListBody"
                    ref={ref => this.listBodyRef = ref}
                >
                    {!!size && <VirtualList
                        key={`${this.state.filter}:${this.state.query}`}
                        size={size}
                        childSize={{width: 150, height: 150}}
                        childCount={entries.length}
                        childRender={this.renderImagePreview(entries)}
                        overScanHeight={200}
                    />}
                </div>
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