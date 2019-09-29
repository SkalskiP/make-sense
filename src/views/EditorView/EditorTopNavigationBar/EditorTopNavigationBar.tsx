import {ContextType} from "../../../data/enums/ContextType";
import './EditorTopNavigationBar.scss';
import React from "react";
import classNames from "classnames";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateImageDragModeStatus} from "../../../store/general/actionCreators";
import {GeneralSelector} from "../../../store/selectors/GeneralSelector";
import {ViewPointSettings} from "../../../settings/ViewPointSettings";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {ViewPortActions} from "../../../logic/actions/ViewPortActions";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {LabelType} from "../../../data/enums/LabelType";
import {AISelector} from "../../../store/selectors/AISelector";
import {AIActions} from "../../../logic/actions/AIActions";
import Fade from "@material-ui/core/Fade";
import withStyles from "@material-ui/core/styles/withStyles";
import {Tooltip} from "@material-ui/core";

interface IProps {
    activeContext: ContextType;
    updateImageDragModeStatus: (imageDragMode: boolean) => any;
    imageDragMode: boolean;
    activeLabelType: LabelType;
}

const EditorTopNavigationBar: React.FC<IProps> = ({activeContext, updateImageDragModeStatus, imageDragMode, activeLabelType}) => {

    const getClassName = () => {
        return classNames(
            "EditorTopNavigationBar",
            {
                "with-context": activeContext === ContextType.EDITOR
            }
        );
    };

    const imageDragOnClick = () => {
        if (imageDragMode) {
            updateImageDragModeStatus(!imageDragMode);
        }
        else if (GeneralSelector.getZoom() !== ViewPointSettings.MIN_ZOOM) {
            updateImageDragModeStatus(!imageDragMode);
        }
    };

    const DarkTooltip = withStyles(theme => ({
        tooltip: {
            backgroundColor: "#171717",
            color: "#ffffff",
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: 120
        },
    }))(Tooltip);

    const attachTooltip = (element: JSX.Element, message: string): JSX.Element => {
        return <DarkTooltip
            disableFocusListener
            title={message}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 500 }}
            placement="bottom"
        >
            <div>
                {element}
            </div>
        </DarkTooltip>
    };

    return (
        <div className={getClassName()}>
            <div className="ButtonWrapper">
                {attachTooltip(<ImageButton
                    image={"ico/zoom-in.png"}
                    imageAlt={"zoom-in"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.zoomIn()}
                />, "Zoom in")}
                {attachTooltip(<ImageButton
                    image={"ico/zoom-out.png"}
                    imageAlt={"zoom-out"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.zoomOut()}
                />, "Zoom out")}
                {attachTooltip(<ImageButton
                    image={"ico/zoom-fit.png"}
                    imageAlt={"zoom-fit"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.setDefaultZoom()}
                />, "Fit image")}
                {attachTooltip(<ImageButton
                    image={"ico/zoom-max.png"}
                    imageAlt={"zoom-max"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.setOneForOneZoom()}
                />, "Max zoom")}
            </div>
            <div className="ButtonWrapper">
                {attachTooltip(<ImageButton
                    image={"ico/hand.png"}
                    imageAlt={"hand"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={imageDragOnClick}
                    isActive={imageDragMode}
                />, "Drag image")}
            </div>
            {activeLabelType === LabelType.RECTANGLE && AISelector.isAIModelLoaded() && <div className="ButtonWrapper">
                {attachTooltip(<ImageButton
                    image={"ico/accept-all.png"}
                    imageAlt={"accept-all"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => AIActions.acceptAllSuggestedRectLabels(LabelsSelector.getActiveImageData())}
                />, "Accept all suggested labels")}
                {attachTooltip(<ImageButton
                    image={"ico/reject-all.png"}
                    imageAlt={"reject-all"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => AIActions.rejectAllSuggestedRectLabels(LabelsSelector.getActiveImageData())}
                />, "Reject all suggested labels")}
            </div>}
        </div>
    )
};

const mapDispatchToProps = {
    updateImageDragModeStatus
};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext,
    imageDragMode: state.general.imageDragMode,
    activeLabelType: state.labels.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorTopNavigationBar);