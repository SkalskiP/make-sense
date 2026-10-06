import React, {useState} from 'react';
import {ISize} from '../../../../interfaces/ISize';
import Scrollbars from 'react-custom-scrollbars-2';
import {ImageData, LabelName, LabelRect} from '../../../../store/labels/types';
import './RectLabelsList.scss';
import {
    updateActiveLabelId,
    updateActiveLabelNameId,
    updateImageDataById
} from '../../../../store/labels/actionCreators';
import {AppState} from '../../../../store';
import {connect} from 'react-redux';
import LabelInputField from '../LabelInputField/LabelInputField';
import EmptyLabelList from '../EmptyLabelList/EmptyLabelList';
import {LabelActions} from '../../../../logic/actions/LabelActions';
import {LabelStatus} from '../../../../data/enums/LabelStatus';
import {findLast} from 'lodash';
import {ImageRepository} from '../../../../logic/imageRepository/ImageRepository';
import {EditorModel} from '../../../../staticModels/EditorModel';
import {ViewPortActions} from '../../../../logic/actions/ViewPortActions';
import {
    ACCEPT_CONFIDENCE_THRESHOLD,
    centerScrollForRect,
    isLowConfidence,
} from '../../../../logic/review/reviewWorkflow';

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataByIdAction: (id: string, newImageData: ImageData) => any;
    activeLabelId: string;
    highlightedLabelId: string;
    updateActiveLabelNameIdAction: (activeLabelId: string) => any;
    labelNames: LabelName[];
    updateActiveLabelIdAction: (activeLabelId: string) => any;
}

const labelNameOf = (labelNames: LabelName[], labelId: string | null): string => {
    if (labelId === null) return 'Unlabeled';
    return findLast(labelNames, {id: labelId})?.name ?? 'Unlabeled';
};

const centerOnBox = (imageData: ImageData, box: LabelRect) => {
    const image = ImageRepository.getById(imageData.id);
    const viewport = EditorModel.viewPortSize;
    if (!image || !viewport) return;
    ViewPortActions.setScrollPosition(centerScrollForRect(
        box.rect,
        ViewPortActions.calculateViewPortContentImageRect(),
        {width: image.width, height: image.height},
        viewport));
};

const RectLabelsList: React.FC<IProps> = (
    {
        size,
        imageData,
        updateImageDataByIdAction,
        labelNames,
        updateActiveLabelNameIdAction,
        activeLabelId,
        highlightedLabelId,
        updateActiveLabelIdAction
    }
) => {
    const [collapsed, setCollapsed] = useState<string[]>([]);
    const accepted = imageData.labelRects
        .filter((labelRect: LabelRect) => labelRect.status === LabelStatus.ACCEPTED);
    const activeBox = accepted.find(box => box.id === activeLabelId) ?? null;
    const aiBoxes = accepted.filter(box => box.isCreatedByAI);
    const acceptable = aiBoxes.filter(box =>
        box.confidence != null && box.confidence >= ACCEPT_CONFIDENCE_THRESHOLD);

    const deleteRectLabelById = (labelRectId: string) => {
        LabelActions.deleteRectLabelById(imageData.id, labelRectId);
    };

    const toggleRectLabelVisibilityById = (labelRectId: string) => {
        LabelActions.toggleLabelVisibilityById(imageData.id, labelRectId);
    };

    const acceptBox = (labelRectId: string) => {
        updateImageDataByIdAction(imageData.id, {
            ...imageData,
            labelRects: imageData.labelRects.map(box =>
                box.id === labelRectId ? {...box, isCreatedByAI: false} : box)
        });
    };

    const acceptAllHighConfidence = () => {
        updateImageDataByIdAction(imageData.id, {
            ...imageData,
            labelRects: imageData.labelRects.map(box =>
                (box.isCreatedByAI && box.confidence != null &&
                    box.confidence >= ACCEPT_CONFIDENCE_THRESHOLD) ?
                    {...box, isCreatedByAI: false} : box)
        });
    };

    const updateRectLabel = (labelRectId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelRects: imageData.labelRects
                .map((labelRect: LabelRect) => {
                    if (labelRect.id === labelRectId) {
                        return {
                            ...labelRect,
                            labelId: labelNameId,
                            status: LabelStatus.ACCEPTED
                        }
                    } else {
                        return labelRect
                    }
                })
        };
        updateImageDataByIdAction(imageData.id, newImageData);
        updateActiveLabelNameIdAction(labelNameId);
    };

    const selectAndCenter = (box: LabelRect) => {
        updateActiveLabelIdAction(box.id);
        centerOnBox(imageData, box);
    };

    const toggleGroup = (labelId: string) => {
        setCollapsed(previous => previous.includes(labelId) ?
            previous.filter(id => id !== labelId) : [...previous, labelId]);
    };

    const groups = new Map<string, LabelRect[]>();
    for (const box of accepted) {
        const key = box.labelId ?? '';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(box);
    }

    const statusBadge = (box: LabelRect) => {
        if (!box.isCreatedByAI) return <span className="status manual" title="Verified manual annotation">✓</span>;
        if (box.confidence == null) return <span className="status ai" title="AI suggestion">AI</span>;
        const percent = Math.round(box.confidence * 100);
        const low = isLowConfidence(box);
        return <span className={low ? 'status ai low' : 'status ai'}
            title={`AI suggestion, confidence ${percent}%`}>
            AI {percent}%{low ? ' ⚠' : ''}
        </span>;
    };

    const renderInspector = () => {
        if (!activeBox) return null;
        const name = labelNameOf(labelNames, activeBox.labelId);
        return (
            <div className="ObjectInspector">
                <div className="inspector-title">Selected object</div>
                <div className="inspector-name">{name}</div>
                <div className="inspector-row">
                    <span>Source</span>
                    <span>{activeBox.isCreatedByAI ? 'AI prediction' : 'Manual'}</span>
                </div>
                {activeBox.isCreatedByAI && activeBox.confidence != null && <div className="inspector-row">
                    <span>Confidence</span>
                    <span>{Math.round(activeBox.confidence * 100)}%</span>
                </div>}
                <div className="inspector-row">
                    <span>Position</span>
                    <span>{`X ${Math.round(activeBox.rect.x)} · Y ${Math.round(activeBox.rect.y)} · ${Math.round(activeBox.rect.width)}×${Math.round(activeBox.rect.height)}`}</span>
                </div>
                <div className="inspector-actions">
                    {activeBox.isCreatedByAI && <button onClick={() => acceptBox(activeBox.id)}>Accept prediction</button>}
                    <button onClick={() => deleteRectLabelById(activeBox.id)}>Delete</button>
                </div>
            </div>
        );
    };

    return (
        <div
            className='RectLabelsList objects'
            style={{width: size.width, height: size.height}}
            onClickCapture={() => updateActiveLabelIdAction(null)}
        >
            <div className="ObjectsHeader" onClick={e => e.stopPropagation()}>
                <span>Objects · {accepted.length}</span>
                {acceptable.length > 0 &&
                    <button onClick={acceptAllHighConfidence}
                        title={`Accept ${acceptable.length} AI predictions at or above ${Math.round(ACCEPT_CONFIDENCE_THRESHOLD * 100)}% confidence`}>
                        Accept ≥{Math.round(ACCEPT_CONFIDENCE_THRESHOLD * 100)}% ({acceptable.length})
                    </button>}
            </div>
            {renderInspector()}
            {accepted.length === 0 ?
                <EmptyLabelList
                    labelBefore={'draw your first bounding box'}
                    labelAfter={'no labels created for this image yet'}
                /> :
                <Scrollbars>
                    {Array.from(groups.entries()).map(([labelId, boxes]) => (
                        <div key={labelId || 'unlabeled'}>
                            <button className="ObjectGroupHeader"
                                onClick={() => toggleGroup(labelId)}
                                aria-expanded={!collapsed.includes(labelId)}>
                                {labelNameOf(labelNames, labelId || null)} · {boxes.length}
                                <span>{collapsed.includes(labelId) ? '▸' : '▾'}</span>
                            </button>
                            {!collapsed.includes(labelId) && boxes.map(box => (
                                <div key={box.id} className="ObjectRow">
                                    <LabelInputField
                                        size={{width: size.width, height: 40}}
                                        isActive={box.id === activeLabelId}
                                        isHighlighted={box.id === highlightedLabelId}
                                        isVisible={box.isVisible}
                                        id={box.id}
                                        value={box.labelId !== null ? findLast(labelNames, {id: box.labelId}) : null}
                                        options={labelNames}
                                        onSelectLabel={updateRectLabel}
                                        onDelete={deleteRectLabelById}
                                        toggleLabelVisibility={toggleRectLabelVisibilityById}
                                    />
                                    <div className="ObjectMeta">
                                        {statusBadge(box)}
                                        <button className="center" title="Select and center viewport on this object"
                                            onClick={() => selectAndCenter(box)}>⌖</button>
                                        {box.isCreatedByAI && <button className="accept" title="Accept this prediction"
                                            onClick={() => acceptBox(box.id)}>Accept</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </Scrollbars>
            }
        </div>
    );
};

const mapDispatchToProps = {
    updateImageDataByIdAction: updateImageDataById,
    updateActiveLabelNameIdAction: updateActiveLabelNameId,
    updateActiveLabelIdAction: updateActiveLabelId
};

const mapStateToProps = (state: AppState) => ({
    activeLabelId: state.labels.activeLabelId,
    highlightedLabelId: state.labels.highlightedLabelId,
    labelNames : state.labels.labels
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RectLabelsList);
