import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelRect} from "../../../../store/labels/types";
import './RectLabelsList.scss';
import {
    updateActiveLabelId,
    updateActiveLabelNameIndex,
    updateImageDataById
} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import LabelInputField from "../LabelInputField/LabelInputField";
import EmptyLabelList from "../EmptyLabelList/EmptyLabelList";
import {LabelActions} from "../../../../logic/actions/LabelActions";

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activeLabelIndex: number;
    activeLabelId: string;
    highlightedLabelId: string;
    updateActiveLabelNameIndex: (activeLabelIndex: number) => any;
    labelNames: string[];
    updateActiveLabelId: (activeLabelId: string) => any;
}

const RectLabelsList: React.FC<IProps> = ({size, imageData, updateImageDataById, labelNames, updateActiveLabelNameIndex, activeLabelId, highlightedLabelId, updateActiveLabelId}) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelRects.length * labelInputFieldHeight
    };

    const deleteRectLabelById = (labelRectId: string) => {
        LabelActions.deleteRectLabelById(imageData.id, labelRectId);
    };

    const updateRectLabel = (labelRectId: string, labelNameIndex: number) => {
        const newImageData = {
            ...imageData,
            labelRects: imageData.labelRects.map((labelRect: LabelRect) => {
                if (labelRect.id === labelRectId) {
                    return {
                        ...labelRect,
                        labelIndex: labelNameIndex
                    }
                } else {
                    return labelRect
                }
            })
        };
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameIndex(labelNameIndex);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
    };

    const getChildren = () => {
        return imageData.labelRects.map((labelRect: LabelRect) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={labelRect.id === activeLabelId}
                isHighlighted={labelRect.id === highlightedLabelId}
                id={labelRect.id}
                key={labelRect.id}
                onDelete={deleteRectLabelById}
                value={labelRect.labelIndex !== null ? labelNames[labelRect.labelIndex] : null}
                options={labelNames}
                onSelectLabel={updateRectLabel}
            />
        });
    };

    return (
        <div
            className="RectLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelRects.length === 0 ?
                <EmptyLabelList
                    labelBefore={"Draw the first rect"}
                    labelAfter={"No labels created for this image"}
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
    updateActiveLabelNameIndex,
    updateActiveLabelId
};

const mapStateToProps = (state: AppState) => ({
    activeLabelIndex: state.labels.activeLabelNameIndex,
    activeLabelId: state.labels.activeLabelId,
    highlightedLabelId: state.labels.highlightedLabelId,
    labelNames : state.labels.labelNames
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RectLabelsList);