import React from 'react';
import './BottomNavigationBar.scss';
import {ImageData} from "../../../store/editor/types";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {ISize} from "../../../interfaces/ISize";
import {ContextType} from "../../../data/ContextType";
import classNames from "classnames";
import {EditorActions} from "../../../logic/actions/EditorActions";

interface IProps {
    size: ISize;
    imageData: ImageData;
    totalImageCount: number;
    activeImageIndex: number;
    activeContext: ContextType;
}

const BottomNavigationBar: React.FC<IProps> = ({size, imageData, totalImageCount, activeImageIndex, activeContext}) => {
    const minWidth:number = 400;
    const viewPreviousImage = () => {
        EditorActions.getPreviousImage();
    };

    const viewNextImage = () => {
        EditorActions.getNextImage();
    };

    const getImageCounter = () => {
        return (activeImageIndex + 1) + " / " + totalImageCount;
    };

    const getClassName = () => {
        return classNames(
            "BottomNavigationBar",
            {
                "with-context": activeContext === ContextType.EDITOR
            }
        );
    };

    return (
        <div className={getClassName()}>
            <ImageButton
                image={"ico/left.png"}
                imageAlt={"previous"}
                size={{width: 25, height: 25}}
                onClick={viewPreviousImage}
                isDisabled={activeImageIndex === 0}
                externalClassName={"left"}
            />
            {size.width > minWidth ?
                <div className="CurrentImageName"> {imageData.fileData.name} </div> :
                <div className="CurrentImageCount"> {getImageCounter()} </div>
            }
            <ImageButton
                image={"ico/right.png"}
                imageAlt={"next"}
                size={{width: 25, height: 25}}
                onClick={viewNextImage}
                isDisabled={activeImageIndex === totalImageCount - 1}
                externalClassName={"right"}
            />
        </div>
    );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeImageIndex: state.editor.activeImageIndex,
    activeContext: state.general.activeContext
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomNavigationBar);
