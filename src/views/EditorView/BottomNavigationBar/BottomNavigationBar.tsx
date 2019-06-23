import React from 'react';
import './BottomNavigationBar.scss';
import {ImageData} from "../../../store/editor/types";
import {updateActiveImageIndex} from "../../../store/editor/actionCreators";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageButton} from "../../Common/ImageButton/ImageButton";

interface IProps {
    imageData: ImageData;
    totalImageCount: number;
    activeImageIndex: number;
    updateActiveImageIndex: (activeImageIndex: number) => any;
}

const BottomNavigationBar: React.FC<IProps> = ({imageData, totalImageCount, activeImageIndex, updateActiveImageIndex}) => {

    const viewPreviousImage = () => {
        if (activeImageIndex > 0) {
            updateActiveImageIndex(activeImageIndex - 1)
        }
    };

    const viewNextImage = () => {
        if (activeImageIndex < totalImageCount - 1) {
            updateActiveImageIndex(activeImageIndex + 1)
        }
    };

    return (
        <div className="BottomNavigationBar">
            <ImageButton
                image={"ico/left.png"}
                imageAlt={"previous"}
                size={{width: 35, height: 35}}
                onClick={viewPreviousImage}
                isDisabled={activeImageIndex === 0}
            />
            <div className="CurrentImageName">
                {imageData.fileData.name}
            </div>
            <ImageButton
                image={"ico/right.png"}
                imageAlt={"next"}
                size={{width: 35, height: 35}}
                onClick={viewNextImage}
                isDisabled={activeImageIndex === totalImageCount - 1}
            />
        </div>
    );
};

const mapDispatchToProps = {
    updateActiveImageIndex
};

const mapStateToProps = (state: AppState) => ({
    activeImageIndex: state.editor.activeImageIndex
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomNavigationBar);
