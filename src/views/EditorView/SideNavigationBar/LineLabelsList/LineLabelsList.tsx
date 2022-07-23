import React from 'react';
import './LineLabelsList.scss';
import {ISize} from '../../../../interfaces/ISize';
import {ImageData, LabelLine, LabelName} from '../../../../store/labels/types';
import {LabelActions} from '../../../../logic/actions/LabelActions';
import LabelInputField from '../LabelInputField/LabelInputField';
import {findLast} from 'lodash';
import EmptyLabelList from '../EmptyLabelList/EmptyLabelList';
import Scrollbars from 'react-custom-scrollbars-2';
import {
    updateActiveLabelId,
    updateActiveLabelNameId,
    updateImageDataById
} from '../../../../store/labels/actionCreators';
import {AppState} from '../../../../store';
import {connect} from 'react-redux';

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

const LineLabelsList: React.FC<IProps> = (
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
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelLines.length * labelInputFieldHeight
    };

    const deleteLineLabelById = (labelLineId: string) => {
        LabelActions.deleteLineLabelById(imageData.id, labelLineId);
    };

    const toggleLineLabelVisibilityById = (labelLineId: string) => {
        LabelActions.toggleLabelVisibilityById(imageData.id, labelLineId);
    };

    const updateLineLabel = (labelLineId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelLines: imageData.labelLines.map((labelLine: LabelLine) => {
                if (labelLine.id === labelLineId) {
                    return {
                        ...labelLine,
                        labelId: labelNameId
                    }
                }
                return labelLine
            })
        };
        updateImageDataByIdAction(imageData.id, newImageData);
        updateActiveLabelNameIdAction(labelNameId);
    };

    const onClickHandler = () => {
        updateActiveLabelIdAction(null);
    };

    const getChildren = () => {
        return imageData.labelLines
            .map((labelLine: LabelLine) => {
                return <LabelInputField
                    size={{
                        width: size.width,
                        height: labelInputFieldHeight
                    }}
                    isActive={labelLine.id === activeLabelId}
                    isHighlighted={labelLine.id === highlightedLabelId}
                    isVisible={labelLine.isVisible}
                    id={labelLine.id}
                    key={labelLine.id}
                    onDelete={deleteLineLabelById}
                    value={labelLine.labelId !== null ? findLast(labelNames, {id: labelLine.labelId}) : null}
                    options={labelNames}
                    onSelectLabel={updateLineLabel}
                    toggleLabelVisibility={toggleLineLabelVisibilityById}
                />
            });
    };

    return (
        <div
            className='LineLabelsList'
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelLines.length === 0 ?
                <EmptyLabelList
                    labelBefore={'draw your first line'}
                    labelAfter={'no labels created for this image yet'}
                /> :
                <Scrollbars>
                    <div
                        className='LineLabelsListContent'
                        style={listStyleContent}
                    >
                        {getChildren()}
                    </div>
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
)(LineLabelsList);
