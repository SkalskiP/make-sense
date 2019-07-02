import React, {useState} from 'react';
import './EditorContainer.scss';
import {SideNavigationBar} from "../SideNavigationBar/SideNavigationBar";
import {Direction} from "../../../data/Direction";
import {VerticalEditorButton} from "../VerticalEditorButton/VerticalEditorButton";
import Editor from "../Editor/Editor";
import BottomNavigationBar from "../BottomNavigationBar/BottomNavigationBar";
import {ISize} from "../../../interfaces/ISize";
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {Settings} from "../../../settings/Settings";
import {ImageData} from "../../../store/editor/types";
import ImagesList from "../SideNavigationBar/ImagesList/ImagesList";

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
            const leftTabWidth = leftTabStatus ? Settings.SIDE_NAVIGATION_BAR_WIDTH_OPEN : Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED;
            const rightTabWidth = rightTabStatus ? Settings.SIDE_NAVIGATION_BAR_WIDTH_OPEN : Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED;
            return {
                width: windowSize.width - leftTabWidth - rightTabWidth,
                height: windowSize.height - Settings.TOP_NAVIGATION_BAR_HEIGHT - Settings.BOTTOM_NAVIGATION_BAR_HEIGHT,
            }
        }
        else
            return null;
    };

    const leftSideBarCompanionRender = () => {
        return [
            <VerticalEditorButton
                label="Images"
                image={"/ico/files.png"}
                imageAlt={"images"}
                onClick={() => setLeftTabStatus(!leftTabStatus)}
                isActive={leftTabStatus}
            />
        ]
    };

    const leftSideBarRender = () => {
        return <ImagesList/>
    };

    const rightSideBarCompanionRender = () => {
        return [
            <VerticalEditorButton
                label="Labels"
                image={"/ico/tags.png"}
                imageAlt={"labels"}
                onClick={() => setRightTabStatus(!rightTabStatus)}
                isActive={rightTabStatus}
            />
        ]
    };

    return (
        <div className="EditorContainer">
            <SideNavigationBar
                direction={Direction.LEFT}
                isOpen={leftTabStatus}
                renderCompanion={leftSideBarCompanionRender}
                renderContent={leftSideBarRender}
            />
            <div className="EditorWrapper">
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