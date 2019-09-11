import React from 'react';
import './ToolBox.scss';
import classNames from "classnames";
import {ContextType} from "../../../data/enums/ContextType";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import ToolBoxTab from "./ToolBoxTab/ToolBoxTab";
import {ToolBoxTabData} from "../../../data/ToolBoxTabData";
import {ViewPortActions} from "../../../logic/actions/ViewPortActions";
import {EditorActions} from "../../../logic/actions/EditorActions";
import {EditorModel} from "../../../staticModels/EditorModel";
import {ISize} from "../../../interfaces/ISize";

interface IProps {
    activeContext: ContextType;
    size: ISize;
}

const ToolBox: React.FC<IProps> = ({activeContext}) => {

    const zoomTabContentData: ToolBoxTabData[] = [
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
        EditorActions.setImageDragModeStatus(!EditorModel.isImageDragModeActive)
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
        <ToolBoxTab
            coverData={{
                image: "ico/zoom-in.png",
                imageAlt: "zoom-in"
            }}
            contentData={zoomTabContentData}
        />
        <ImageButton
            image={"ico/hand.png"}
            imageAlt={"hand"}
            buttonSize={{width: 40, height:40}}
            padding={20}
            onClick={imageDragOnClick}
            isActive={EditorModel.isImageDragModeActive}
        />
    </div>
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBox);