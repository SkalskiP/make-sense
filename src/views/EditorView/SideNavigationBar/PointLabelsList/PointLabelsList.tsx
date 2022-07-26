import React from 'react';
import {ISize} from '../../../../interfaces/ISize';
import Scrollbars from 'react-custom-scrollbars-2';
import {ImageData, LabelName, LabelPoint} from '../../../../store/labels/types';
import './PointLabelsList.scss';
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
import {findLast} from 'lodash';
import {LabelStatus} from '../../../../data/enums/LabelStatus';

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

const PointLabelsList: React.FC<IProps> = (
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
        height: imageData.labelPoints.length * labelInputFieldHeight
    };

    const deletePointLabelById = (labelPointId: string) => {
        LabelActions.deletePointLabelById(imageData.id, labelPointId);
    };

    const togglePointLabelVisibilityById = (labelPointId: string) => {
        LabelActions.toggleLabelVisibilityById(imageData.id, labelPointId);
    };

    const updatePointLabel = (labelPointId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelPoints: imageData.labelPoints.map((labelPoint: LabelPoint) => {
                if (labelPoint.id === labelPointId) {
                    return {
                        ...labelPoint,
                        labelId: labelNameId
                    }
                }
                return labelPoint
            })
        };
        updateImageDataByIdAction(imageData.id, newImageData);
        updateActiveLabelNameIdAction(labelNameId);
    };

    const onClickHandler = () => {
        updateActiveLabelIdAction(null);
    };

    const getChildren = () => {
        return imageData.labelPoints
            .filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED)
            .map((labelPoint: LabelPoint) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={labelPoint.id === activeLabelId}
                isHighlighted={labelPoint.id === highlightedLabelId}
                isVisible={labelPoint.isVisible}
                id={labelPoint.id}
                key={labelPoint.id}
                onDelete={deletePointLabelById}
                value={labelPoint.labelId !== null ? findLast(labelNames, {id: labelPoint.labelId}) : null}
                options={labelNames}
                onSelectLabel={updatePointLabel}
                toggleLabelVisibility={togglePointLabelVisibilityById}
            />
        });
    };

    return (
        <div
            className='PointLabelsList'
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelPoints.filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED).length === 0 ?
                <EmptyLabelList
                    labelBefore={'mark your first point'}
                    labelAfter={'no labels created for this image yet'}
                /> :
                <Scrollbars>
                    <div
                        className='PointLabelsListContent'
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
)(PointLabelsList);
