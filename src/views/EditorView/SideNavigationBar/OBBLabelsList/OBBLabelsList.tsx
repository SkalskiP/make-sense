import React from 'react';
import {ISize} from '../../../../interfaces/ISize';
import Scrollbars from 'react-custom-scrollbars-2';
import {ImageData, LabelName, LabelOBB} from '../../../../store/labels/types';
import './OBBLabelsList.scss';
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

const OBBLabelsList: React.FC<IProps> = (
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
    const labelOBBs = imageData.labelOBBs || [];
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: labelOBBs.length * labelInputFieldHeight
    };

    const deleteOBBLabelById = (labelOBBId: string) => {
        LabelActions.deleteOBBLabelById(imageData.id, labelOBBId);
    };

    const toggleOBBLabelVisibilityById = (labelOBBId: string) => {
        LabelActions.toggleLabelVisibilityById(imageData.id, labelOBBId);
    };

    const updateOBBLabel = (labelOBBId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelOBBs: (imageData.labelOBBs || [])
                .map((labelOBB: LabelOBB) => {
                    if (labelOBB.id === labelOBBId) {
                        return {
                            ...labelOBB,
                            labelId: labelNameId,
                            status: LabelStatus.ACCEPTED
                        }
                    } else {
                        return labelOBB
                    }
                })
        };
        updateImageDataByIdAction(imageData.id, newImageData);
        updateActiveLabelNameIdAction(labelNameId);
    };

    const onClickHandler = () => {
        updateActiveLabelIdAction(null);
    };

    const getChildren = () => {
        return labelOBBs
            .filter((labelOBB: LabelOBB) => labelOBB.status === LabelStatus.ACCEPTED)
            .map((labelOBB: LabelOBB) => {
                return <LabelInputField
                    size={{
                        width: size.width,
                        height: labelInputFieldHeight
                    }}
                    isActive={labelOBB.id === activeLabelId}
                    isHighlighted={labelOBB.id === highlightedLabelId}
                    isVisible={labelOBB.isVisible}
                    id={labelOBB.id}
                    key={labelOBB.id}
                    onDelete={deleteOBBLabelById}
                    value={labelOBB.labelId !== null ? findLast(labelNames, {id: labelOBB.labelId}) : null}
                    options={labelNames}
                    onSelectLabel={updateOBBLabel}
                    toggleLabelVisibility={toggleOBBLabelVisibilityById}
                />
            });
    };

    return (
        <div
            className='OBBLabelsList'
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {labelOBBs.filter((labelOBB: LabelOBB) => labelOBB.status === LabelStatus.ACCEPTED).length === 0 ?
                <EmptyLabelList
                    labelBefore={'draw your first oriented bounding box'}
                    labelAfter={'no labels created for this image yet'}
                /> :
                <Scrollbars>
                    <div
                        className='OBBLabelsListContent'
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
)(OBBLabelsList);
