import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelName, LabelRect, LabelAutoRect} from "../../../../store/labels/types";
import './AutoRectLabelsList.scss';
import {
    updateActiveLabelId,
    updateActiveLabelNameId,
    updateImageDataById
} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import LabelInputField from "../LabelInputField/LabelInputField";
import EmptyLabelList from "../EmptyLabelList/EmptyLabelList";
import {LabelActions} from "../../../../logic/actions/LabelActions";
import {LabelStatus} from "../../../../data/enums/LabelStatus";
import {findLast} from "lodash";

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activeLabelId: string;
    highlightedLabelId: string;
    updateActiveLabelNameId: (activeLabelId: string) => any;
    labelNames: LabelName[];
    updateActiveLabelId: (activeLabelId: string) => any;
}

const AutoRectLabelsList: React.FC<IProps> = ({size, imageData, updateImageDataById, labelNames, updateActiveLabelNameId, activeLabelId, highlightedLabelId, updateActiveLabelId}) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelAutoRects.length * labelInputFieldHeight
    };

    const deleteAutoRectLabelById = (labelAutoRectId: string) => {
        LabelActions.deleteAutoRectLabelById(imageData.id, labelAutoRectId);
    };

    const updateAutoRectLabel = (labelAutoRectId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelAutoRects: imageData.labelAutoRects
                .map((labelAutoRect: LabelAutoRect) => {
                if (labelAutoRect.id === labelAutoRectId) {
                    return {
                        ...labelAutoRect,
                        labelId: labelNameId,
                        status: LabelStatus.ACCEPTED
                    }
                } else {
                    return labelAutoRect
                }
            })
        };
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameId(labelNameId);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
    };

    const getChildren = () => {
        return imageData.labelAutoRects
            .filter((labelAutoRect: LabelAutoRect) => labelAutoRect.status === LabelStatus.ACCEPTED)
            .map((labelAutoRect: LabelAutoRect) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={labelAutoRect.id === activeLabelId}
                isHighlighted={labelAutoRect.id === highlightedLabelId}
                id={labelAutoRect.id}
                key={labelAutoRect.id}
                onDelete={deleteAutoRectLabelById}
                value={labelAutoRect.labelId !== null ? findLast(labelNames, {id: labelAutoRect.labelId}) : null}
                options={labelNames}
                onSelectLabel={updateAutoRectLabel}
            />
        });
    };

    return (
        <div
            className="AutoRectLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelRects.filter((labelAutoRect: LabelAutoRect) => labelAutoRect.status === LabelStatus.ACCEPTED).length === 0 ?
                <EmptyLabelList
                    labelBefore={"draw your first auto bounding box"}
                    labelAfter={"no labels created for this image yet"}
                /> :
                <Scrollbars>
                    <div
                        className="RectLabelsListContent"
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
    updateImageDataById,
    updateActiveLabelNameId,
    updateActiveLabelId
};

const mapStateToProps = (state: AppState) => ({
    activeLabelId: state.labels.activeLabelId,
    highlightedLabelId: state.labels.highlightedLabelId,
    labelNames : state.labels.labels
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoRectLabelsList);
