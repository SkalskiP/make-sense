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

interface IProps {
    activeContext: ContextType;
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
            imageAlt: "zoom-fit"
        },
        {
            image: "ico/zoom-max.png",
            imageAlt: "zoom-max"
        }
    ]

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
            onClick={() => {}}
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