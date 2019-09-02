import React, {useState} from 'react';
import {connect} from "react-redux";
import {Direction} from "../../../data/Direction";
import {ISize} from "../../../interfaces/ISize";
import {Settings} from "../../../settings/Settings";
import {AppState} from "../../../store";
import {ImageData} from "../../../store/editor/types";
import ImagesList from "../SideNavigationBar/ImagesList/ImagesList";
import LabelsToolkit from "../SideNavigationBar/LabelsToolkit/LabelsToolkit";
import {SideNavigationBar} from "../SideNavigationBar/SideNavigationBar";
import {VerticalEditorButton} from "../VerticalEditorButton/VerticalEditorButton";
import './EditorContainer.scss';
import Editor from "../Editor/Editor";
import BottomNavigationBar from "../BottomNavigationBar/BottomNavigationBar";
import {ContextManager} from "../../../logic/context/ContextManager";
import {ContextType} from "../../../data/ContextType";

interface IProps {
    windowSize: ISize;
    activeImageIndex: number;
    imagesData: ImageData[];
}

const EditorContainer: React.FC<IProps> = ({windowSize, activeImageIndex, imagesData}) => {
    const [leftTabStatus, setLeftTabStatus] = useState(true);
    const [rightTabStatus, setRightTabStatus] = useState(true);

    const calculateEditorSize = (): ISize => {
        if (windowSize) {
            const leftTabWidth = leftTabStatus ? Settings.SIDE_NAVIGATION_BAR_WIDTH_OPEN_PX : Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX;
            const rightTabWidth = rightTabStatus ? Settings.SIDE_NAVIGATION_BAR_WIDTH_OPEN_PX : Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX;
            return {
                width: windowSize.width - leftTabWidth - rightTabWidth,
                height: windowSize.height - Settings.TOP_NAVIGATION_BAR_HEIGHT_PX - Settings.BOTTOM_NAVIGATION_BAR_HEIGHT_PX,
            }
        }
        else
            return null;
    };

    const leftSideBarCompanionRender = () => {
        return <>
            <VerticalEditorButton
                label="Images"
                image={"/ico/files.png"}
                imageAlt={"images"}
                onClick={() => setLeftTabStatus(!leftTabStatus)}
                isActive={leftTabStatus}
            />
        </>
    };

    const leftSideBarRender = () => {
        return <ImagesList/>
    };

    const rightSideBarCompanionRender = () => {
        return <>
            <VerticalEditorButton
                label="Labels"
                image={"/ico/tags.png"}
                imageAlt={"labels"}
                onClick={() => setRightTabStatus(!rightTabStatus)}
                isActive={rightTabStatus}
            />
        </>
    };

    const rightSideBarRender = () => {
        return <LabelsToolkit/>
    };

    return (
        <div className="EditorContainer">
            <SideNavigationBar
                direction={Direction.LEFT}
                isOpen={leftTabStatus}
                renderCompanion={leftSideBarCompanionRender}
                renderContent={leftSideBarRender}
            />
            <div className="EditorWrapper"
                onMouseDown={() => ContextManager.switchCtx(ContextType.EDITOR)}
            >
                <Editor
                    size={calculateEditorSize()}
                    imageData={imagesData[activeImageIndex]}
                />
                <BottomNavigationBar
                    imageData={imagesData[activeImageIndex]}
                    size={calculateEditorSize()}
                    totalImageCount={imagesData.length}
                />
            </div>
            <SideNavigationBar
                direction={Direction.RIGHT}
                isOpen={rightTabStatus}
                renderCompanion={rightSideBarCompanionRender}
                renderContent={rightSideBarRender}
            />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    windowSize: state.general.windowSize,
    activeImageIndex: state.editor.activeImageIndex,
    imagesData: state.editor.imagesData
});

export default connect(
    mapStateToProps
)(EditorContainer);