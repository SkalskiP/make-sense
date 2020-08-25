import React from 'react';
import './LineLabelsList.scss';
import {ISize} from "../../../../interfaces/ISize";
import {ImageData, LabelLine, LabelName} from "../../../../store/labels/types";
import {LabelActions} from "../../../../logic/actions/LabelActions";
import LabelInputField from "../LabelInputField/LabelInputField";
import {findLast} from "lodash";
import EmptyLabelList from "../EmptyLabelList/EmptyLabelList";
import Scrollbars from "react-custom-scrollbars";
import {
    updateActiveLabelId,
    updateActiveLabelNameId,
    updateImageDataById
} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";

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

const LineLabelsList: React.FC<IProps> = (
    {
        size,
        imageData,
        updateImageDataById,
        labelNames,
        updateActiveLabelNameId,
        activeLabelId,
        highlightedLabelId,
        updateActiveLabelId
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
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameId(labelNameId);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
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
                    id={labelLine.id}
                    key={labelLine.id}
                    onDelete={deleteLineLabelById}
                    value={labelLine.labelId !== null ? findLast(labelNames, {id: labelLine.labelId}) : null}
                    options={labelNames}
                    onSelectLabel={updateLineLabel}
                />
            });
    };

    return (
        <div
            className="LineLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelLines.length === 0 ?
                <EmptyLabelList
                    labelBefore={"draw your first line"}
                    labelAfter={"no labels created for this image yet"}
                /> :
                <Scrollbars>
                    <div
                        className="LineLabelsListContent"
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
)(LineLabelsList);