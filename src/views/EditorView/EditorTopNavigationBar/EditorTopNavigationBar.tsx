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

interface IProps {
    activeContext: ContextType;
    updateImageDragModeStatus: (imageDragMode: boolean) => any;
    imageDragMode: boolean;
}

const EditorTopNavigationBar: React.FC<IProps> = ({activeContext, updateImageDragModeStatus, imageDragMode}) => {

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

    return (
        <div className={getClassName()}>
            <div className="ButtonWrapper">
                <ImageButton
                    image={"ico/zoom-in.png"}
                    imageAlt={"zoom-in"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.zoomIn()}
                />
                <ImageButton
                    image={"ico/zoom-out.png"}
                    imageAlt={"zoom-out"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.zoomOut()}
                />
                <ImageButton
                    image={"ico/zoom-fit.png"}
                    imageAlt={"zoom-fit"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.setDefaultZoom()}
                />
                <ImageButton
                    image={"ico/zoom-max.png"}
                    imageAlt={"zoom-max"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={() => ViewPortActions.setOneForOneZoom()}
                />
            </div>
            <div className="ButtonWrapper">
                <ImageButton
                    image={"ico/hand.png"}
                    imageAlt={"hand"}
                    buttonSize={{width: 30, height: 30}}
                    padding={10}
                    onClick={imageDragOnClick}
                    isActive={imageDragMode}
                />
            </div>
        </div>
    )
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
)(EditorTopNavigationBar);