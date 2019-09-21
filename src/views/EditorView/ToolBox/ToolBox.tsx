import React from 'react';
import './ToolBox.scss';
import classNames from "classnames";
import {ContextType} from "../../../data/enums/ContextType";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {ImageButtonDropDownData} from "../../../data/ImageButtonDropDownData";
import {ViewPortActions} from "../../../logic/actions/ViewPortActions";
import {ISize} from "../../../interfaces/ISize";
import {updateImageDragModeStatus} from "../../../store/general/actionCreators";
import ImageButtonDropDown from "./ImageButtonDropDown/ImageButtonDropDown";
import {ViewPointSettings} from "../../../settings/ViewPointSettings";
import {GeneralSelector} from "../../../store/selectors/GeneralSelector";

interface IProps {
    activeContext: ContextType;
    size: ISize;
    updateImageDragModeStatus: (imageDragMode: boolean) => any;
    imageDragMode: boolean;
}

const ToolBox: React.FC<IProps> = ({activeContext, updateImageDragModeStatus, imageDragMode}) => {

    const zoomDropDownContentData: ImageButtonDropDownData[] = [
        {
            image: "ico/zoom-in.png",
            imageAlt: "zoom-in",
            onClick: () => ViewPortActions.zoomIn()
        },
        {
            image: "ico/zoom-out.png",
            imageAlt: "zoom-out",
            onClick: () => ViewPortActions.zoomOut()
        },
        {
            image: "ico/zoom-fit.png",
            imageAlt: "zoom-fit",
            onClick: () => ViewPortActions.setDefaultZoom()
        },
        {
            image: "ico/zoom-max.png",
            imageAlt: "zoom-max",
            onClick: () => ViewPortActions.setOneForOneZoom()
        }
    ];

    const imageDragOnClick = () => {
        if (GeneralSelector.getZoom() !== ViewPointSettings.MIN_ZOOM) {
            updateImageDragModeStatus(!imageDragMode);
        }
    };

    const getClassName = () => {
        return classNames(
            "ToolBox",
            {
                "with-context": activeContext === ContextType.EDITOR
            }
        );
    };

    return <div
        className={getClassName()}
    >
        <ImageButtonDropDown
            coverData={{
                image: "ico/zoom-in.png",
                imageAlt: "zoom-in"
            }}
            contentData={zoomDropDownContentData}
        />
        <ImageButton
            image={"ico/hand.png"}
            imageAlt={"hand"}
            buttonSize={{width: 40, height:40}}
            padding={20}
            onClick={imageDragOnClick}
            isActive={imageDragMode}
        />
    </div>
};

const mapDispatchToProps = {
    updateImageDragModeStatus
};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext,
    imageDragMode: state.general.imageDragMode
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBox);