import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelName, LabelPolygon} from "../../../../store/labels/types";
import './PolygonLabelsList.scss';
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

const PolygonLabelsList: React.FC<IProps> = ({size, imageData, updateImageDataById, labelNames, updateActiveLabelNameId, activeLabelId, highlightedLabelId, updateActiveLabelId}) => {
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

    const updatePolygonLabel = (labelPolygonId: string, labelNameId: string) => {
        const newImageData = {
            ...imageData,
            labelPolygons: imageData.labelPolygons.map((currentLabel: LabelPolygon) => {
                if (currentLabel.id === labelPolygonId) {
                    return {
                        ...currentLabel,
                        labelId: labelNameId
                    }
                }
                return currentLabel
            })
        };
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameId(labelNameId);
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
                value={labelPolygon.labelId !== null ? findLast(labelNames, {id: labelPolygon.labelId}) : null}
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
                    labelBefore={"draw your first polygon"}
                    labelAfter={"no labels created for this image yet"}
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
)(PolygonLabelsList);