import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelRect} from "../../../../store/editor/types";
import './RectLabelsList.scss';
import {LabelInputField} from "../LabelInputField/LabelInputField";
import {updateActiveLabelIndex, updateImageDataById} from "../../../../store/editor/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import * as _ from "lodash";

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activeLabelIndex: number;
    activeLabelId: string;
    updateActiveLabelIndex: (activeLabelIndex: number) => any;
    labelNames: string[];
}

const RectLabelsList: React.FC<IProps> = ({size, imageData, updateImageDataById, labelNames, updateActiveLabelIndex}) => {
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
        const newImageData = {
            ...imageData,
            labelRects: _.filter(imageData.labelRects, (currentLabel: LabelRect) => {
                return currentLabel.id !== labelRectId;
            })
        };
        updateImageDataById(imageData.id, newImageData);
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
        updateActiveLabelIndex(labelNameIndex);
    };

    const children =
        imageData.labelRects.map((labelRect: LabelRect) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={false}
                id={labelRect.id}
                key={labelRect.id}
                onDelete={deleteRectLabelById}
                value={labelRect.labelIndex !== null ? labelNames[labelRect.labelIndex] : null}
                options={labelNames}
                onSelectLabel={updateRectLabel}
            />
        });

    return (
        <div
            className="RectLabelsList"
            style={listStyle}
        >
            <Scrollbars>
                <div
                    className="RectLabelsListContent"
                    style={listStyleContent}
                >
                    {children}
                </div>
            </Scrollbars>
        </div>
    );
};

const mapDispatchToProps = {
    updateImageDataById,
    updateActiveLabelIndex
};

const mapStateToProps = (state: AppState) => ({
    activeLabelIndex: state.editor.activeLabelIndex,
    activeLabelId: state.editor.activeLabelId,
    labelNames : state.editor.labelNames
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RectLabelsList);