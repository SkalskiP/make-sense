import {ContextType} from "../../../data/enums/ContextType";
import './EditorTopNavigationBar.scss';
import React from "react";
import classNames from "classnames";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateCrossHairVisibleStatus, updateImageDragModeStatus} from "../../../store/general/actionCreators";
import {GeneralSelector} from "../../../store/selectors/GeneralSelector";
import {ViewPointSettings} from "../../../settings/ViewPointSettings";
import {ImageButton} from "../../Common/ImageButton/ImageButton";
import {ViewPortActions} from "../../../logic/actions/ViewPortActions";
import {LabelsSelector} from "../../../store/selectors/LabelsSelector";
import {LabelType} from "../../../data/enums/LabelType";
import {AISelector} from "../../../store/selectors/AISelector";
import {ISize} from "../../../interfaces/ISize";
import {AIActions} from "../../../logic/actions/AIActions";

interface IProps {
    activeContext: ContextType;
    updateImageDragModeStatus: (imageDragMode: boolean) => any;
    updateCrossHairVisibleStatus: (crossHairVisible: boolean) => any;
    imageDragMode: boolean;
    crossHairVisible: boolean;
    activeLabelType: LabelType;
}

const EditorTopNavigationBar: React.FC<IProps> = (
    {
        activeContext,
        updateImageDragModeStatus,
        updateCrossHairVisibleStatus,
        imageDragMode,
        crossHairVisible,
        activeLabelType
    }) => {
    const buttonSize: ISize = {width: 30, height: 30};
    const buttonPadding: number = 10;

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

    const crossHairOnClick = () => {
        updateCrossHairVisibleStatus(!crossHairVisible);
    }

    return (
        <div className={getClassName()}>
            <div className="ButtonWrapper">
                <ImageButton
                    image={"ico/zoom-in.png"}
                    imageAlt={"zoom-in"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={() => ViewPortActions.zoomIn()}
                />
                <ImageButton
                    image={"ico/zoom-out.png"}
                    imageAlt={"zoom-out"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={() => ViewPortActions.zoomOut()}
                />
                <ImageButton
                    image={"ico/zoom-fit.png"}
                    imageAlt={"zoom-fit"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={() => ViewPortActions.setDefaultZoom()}
                />
                <ImageButton
                    image={"ico/zoom-max.png"}
                    imageAlt={"zoom-max"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={() => ViewPortActions.setOneForOneZoom()}
                />
            </div>
            <div className="ButtonWrapper">
                <ImageButton
                    image={"ico/hand.png"}
                    imageAlt={"hand"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={imageDragOnClick}
                    isActive={imageDragMode}
                />
                <ImageButton
                    image={"ico/cross-hair.png"}
                    imageAlt={"cross-hair"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={crossHairOnClick}
                    isActive={crossHairVisible}
                />
            </div>
            {((activeLabelType === LabelType.RECT && AISelector.isAIObjectDetectorModelLoaded()) ||
                (activeLabelType === LabelType.POINT && AISelector.isAIPoseDetectorModelLoaded())) && <div className="ButtonWrapper">
                <ImageButton
                    image={"ico/accept-all.png"}
                    imageAlt={"accept-all"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={() => AIActions.acceptAllSuggestedLabels(LabelsSelector.getActiveImageData())}
                />
                <ImageButton
                    image={"ico/reject-all.png"}
                    imageAlt={"reject-all"}
                    buttonSize={buttonSize}
                    padding={buttonPadding}
                    onClick={() => AIActions.rejectAllSuggestedLabels(LabelsSelector.getActiveImageData())}
                />
            </div>}
        </div>
    )
};

const mapDispatchToProps = {
    updateImageDragModeStatus,
    updateCrossHairVisibleStatus
};

const mapStateToProps = (state: AppState) => ({
    activeContext: state.general.activeContext,
    imageDragMode: state.general.imageDragMode,
    crossHairVisible: state.general.crossHairVisible,
    activeLabelType: state.labels.activeLabelType
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorTopNavigationBar);