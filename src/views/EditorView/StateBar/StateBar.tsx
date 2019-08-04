import React from 'react';
import './StateBar.scss';
import {ImageData} from "../../../store/editor/types";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {LabelType} from "../../../data/LabelType";

interface IProps {
    imagesData: ImageData[];
    activeLabelType: LabelType;
}

const StateBar: React.FC<IProps> = ({imagesData, activeLabelType}) => {

    const pointLabeledImages = imagesData.reduce((currentCount: number, currentImage: ImageData) => {
        return currentCount + (currentImage.labelPoints.length > 0 ? 1 : 0);
    }, 0);

    const rectLabeledImages = imagesData.reduce((currentCount: number, currentImage: ImageData) => {
        return currentCount + (currentImage.labelRects.length > 0 ? 1 : 0);
    }, 0);

    const getProgress = () => {
        switch (activeLabelType) {
            case LabelType.POINT:
                return (100 * pointLabeledImages) / imagesData.length;
            case LabelType.RECTANGLE:
                return (100 * rectLabeledImages) / imagesData.length;
            default:
                return 0;
        }
    };

    return (
        <div className="StateBar">
            <div
                style={{width: getProgress() + "%"}}
                className="done"
            />
        </div>
    );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    imagesData: state.editor.imagesData,
    activeLabelType: state.editor.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StateBar);