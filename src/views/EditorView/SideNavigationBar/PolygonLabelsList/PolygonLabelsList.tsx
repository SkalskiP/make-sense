import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelPolygon} from "../../../../store/labels/types";
import './PolygonLabelsList.scss';
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

const PolygonLabelsList: React.FC<IProps> = ({size, imageData, updateImageDataById, labelNames, updateActiveLabelNameIndex, activeLabelId, highlightedLabelId, updateActiveLabelId}) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelPolygons.length * labelInputFieldHeight
    };

    const deletePolygonLabelById = (labelPolygonId: string) => {
        LabelActions.deletePolygonLabelById(imageData.id, labelPolygonId);
    };

    const updatePolygonLabel = (labelPolygonId: string, labelNameIndex: number) => {
        const newImageData = {
            ...imageData,
            labelPolygons: imageData.labelPolygons.map((currentLabel: LabelPolygon) => {
                if (currentLabel.id === labelPolygonId) {
                    return {
                        ...currentLabel,
                        labelIndex: labelNameIndex
                    }
                }
                return currentLabel
            })
        };
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameIndex(labelNameIndex);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
    };

    const getChildren = () => {
        return imageData.labelPolygons.map((labelPolygon: LabelPolygon) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={labelPolygon.id === activeLabelId}
                isHighlighted={labelPolygon.id === highlightedLabelId}
                id={labelPolygon.id}
                key={labelPolygon.id}
                onDelete={deletePolygonLabelById}
                value={labelPolygon.labelIndex !== null ? labelNames[labelPolygon.labelIndex] : null}
                options={labelNames}
                onSelectLabel={updatePolygonLabel}
            />
        });
    };

    return (
        <div
            className="PolygonLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelPolygons.length === 0 ?
                <EmptyLabelList
                    labelBefore={"Mark the first polygon"}
                    labelAfter={"No labels created for this image"}
                /> :
                <Scrollbars>
                    <div
                        className="PolygonLabelsListContent"
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
)(PolygonLabelsList);