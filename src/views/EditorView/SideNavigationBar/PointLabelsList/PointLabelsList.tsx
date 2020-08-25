import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelName, LabelPoint} from "../../../../store/labels/types";
import './PointLabelsList.scss';
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
import {findLast} from "lodash";
import {LabelStatus} from "../../../../data/enums/LabelStatus";

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

const PointLabelsList: React.FC<IProps> = (
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
        height: imageData.labelPoints.length * labelInputFieldHeight
    };

    const deletePointLabelById = (labelPointId: string) => {
        LabelActions.deletePointLabelById(imageData.id, labelPointId);
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
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameId(labelNameId);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
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
                id={labelPoint.id}
                key={labelPoint.id}
                onDelete={deletePointLabelById}
                value={labelPoint.labelId !== null ? findLast(labelNames, {id: labelPoint.labelId}) : null}
                options={labelNames}
                onSelectLabel={updatePointLabel}
            />
        });
    };

    return (
        <div
            className="PointLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelPoints.filter((labelPoint: LabelPoint) => labelPoint.status === LabelStatus.ACCEPTED).length === 0 ?
                <EmptyLabelList
                    labelBefore={"mark your first point"}
                    labelAfter={"no labels created for this image yet"}
                /> :
                <Scrollbars>
                    <div
                        className="PointLabelsListContent"
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
)(PointLabelsList);