import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Direction} from '../../../data/enums/Direction';
import {ISize} from '../../../interfaces/ISize';
import {Settings} from '../../../settings/Settings';
import {AppState} from '../../../store';
import {ImageData} from '../../../store/labels/types';
import ImagesList from '../SideNavigationBar/ImagesList/ImagesList';
import LabelsToolkit from '../SideNavigationBar/LabelsToolkit/LabelsToolkit';
import {SideNavigationBar} from '../SideNavigationBar/SideNavigationBar';
import {VerticalEditorButton} from '../VerticalEditorButton/VerticalEditorButton';
import './EditorContainer.scss';
import Editor from '../Editor/Editor';
import {ContextManager} from '../../../logic/context/ContextManager';
import {ContextType} from '../../../data/enums/ContextType';
import EditorBottomNavigationBar from '../EditorBottomNavigationBar/EditorBottomNavigationBar';
import EditorTopNavigationBar from '../EditorTopNavigationBar/EditorTopNavigationBar';
import {ProjectType} from '../../../data/enums/ProjectType';
import {
    FASHION_STYLE_CODE_FOR_MAN,
    FASHION_STYLE_CODE_FOR_WOMAN,
    GENDER
} from '../../../data/enums/ItemType';
import _ from 'lodash';
import {LabelsSelector} from '../../../store/selectors/LabelsSelector';
import {vi as lang} from '../../../lang';
interface IProps {
    windowSize: ISize;
    activeImageIndex: number;
    imagesData: ImageData[];
    activeContext: ContextType;
    projectType: ProjectType;
}

const EditorContainer: React.FC<IProps> = ({
    windowSize,
    activeImageIndex,
    imagesData,
    activeContext,
    projectType
}) => {
    const [leftTabStatus, setLeftTabStatus] = useState(true);
    const [rightTabStatus, setRightTabStatus] = useState(true);
    const [guideTabStatus, setGuideTabStatus] = useState(true);

    const calculateEditorSize = (): ISize => {
        if (windowSize) {
            const leftTabWidth = leftTabStatus
                ? Settings.SIDE_NAVIGATION_BAR_WIDTH_OPEN_PX
                : Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX;
            const rightTabWidth = rightTabStatus
                ? Settings.SIDE_NAVIGATION_BAR_WIDTH_OPEN_PX
                : Settings.SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX;
            const guideTabWidth = guideTabStatus
                ? Settings.GUIDE_SIDE_NAVIGATION_BAR_WIDTH_OPEN_PX
                : Settings.GUIDE_SIDE_NAVIGATION_BAR_WIDTH_CLOSED_PX;
            return {
                width:
                    windowSize.width -
                    leftTabWidth -
                    rightTabWidth -
                    guideTabWidth,
                height:
                    windowSize.height -
                    Settings.TOP_NAVIGATION_BAR_HEIGHT_PX -
                    Settings.EDITOR_BOTTOM_NAVIGATION_BAR_HEIGHT_PX -
                    Settings.EDITOR_TOP_NAVIGATION_BAR_HEIGHT_PX
            };
        } else return null;
    };

    const leftSideBarButtonOnClick = () => {
        if (!leftTabStatus) ContextManager.switchCtx(ContextType.LEFT_NAVBAR);
        else if (leftTabStatus && activeContext === ContextType.LEFT_NAVBAR)
            ContextManager.restoreCtx();

        setLeftTabStatus(!leftTabStatus);
    };

    const leftSideBarCompanionRender = () => {
        return (
            <>
                <VerticalEditorButton
                    label="Images"
                    image={'/ico/camera.png'}
                    imageAlt={'images'}
                    onClick={leftSideBarButtonOnClick}
                    isActive={leftTabStatus}
                />
            </>
        );
    };

    const leftSideBarRender = () => {
        return <ImagesList />;
    };

    const rightSideBarButtonOnClick = () => {
        if (!rightTabStatus) ContextManager.switchCtx(ContextType.RIGHT_NAVBAR);
        else if (rightTabStatus && activeContext === ContextType.RIGHT_NAVBAR)
            ContextManager.restoreCtx();

        setRightTabStatus(!rightTabStatus);
    };

    const rightSideBarCompanionRender = () => {
        return (
            <>
                <VerticalEditorButton
                    label="Labels"
                    image={'/ico/tags.png'}
                    imageAlt={'labels'}
                    onClick={rightSideBarButtonOnClick}
                    isActive={rightTabStatus}
                />
            </>
        );
    };

    const rightSideBarRender = () => {
        return <LabelsToolkit />;
    };

    const guideSideBarButtonOnClick = () => {
        if (!guideTabStatus) ContextManager.switchCtx(ContextType.GUIDE_NAVBAR);
        else if (guideTabStatus && activeContext === ContextType.GUIDE_NAVBAR)
            ContextManager.restoreCtx();

        setGuideTabStatus(!guideTabStatus);
    };
    const guideSideBarCompanionRender = () => {
        return (
            <>
                <VerticalEditorButton
                    label="Guides"
                    image={'/ico/small_window.png'}
                    imageAlt={'guides'}
                    onClick={guideSideBarButtonOnClick}
                    isActive={rightTabStatus}
                />
            </>
        );
    };

    const renderGuide = () => {
        const activeImageData = LabelsSelector.getActiveImageData();
        const activeGender =
            LabelsSelector.getActiveGender() === GENDER.MAN
                ? GENDER.MAN
                : GENDER.WOMAN;
        if (activeImageData.guideStyles) {
            // console.log('Guide styles = ', activeImageData.guideStyles);
            return (
                <div
                    style={{
                        overflowY: 'scroll'
                    }}>
                    {activeImageData.guideStyles
                        .map((guide) => {
                            if (guide?.seq) {
                                return parseInt(guide.seq);
                            } else {
                                return activeGender === GENDER.WOMAN
                                    ? FASHION_STYLE_CODE_FOR_WOMAN.BASIC
                                    : FASHION_STYLE_CODE_FOR_MAN.GENTLEMAN;
                            }
                        })
                        .map((style) => {
                            console.log('style == ', style);
                            const images = _.range(5).map((i) => {
                                const src = `guides/${activeGender + 1}/${
                                    activeGender + 1
                                }_${style}/${i + 1}.jpg`;
                                // console.log('src', src);

                                return (
                                    <img
                                        key={src}
                                        alt="sample images"
                                        src={src}
                                        style={{width: 84, height: 105}}
                                    />
                                );
                            });

                            const {name: styleString = 'unknown'} = _.find(
                                activeImageData.guideStyles,
                                {seq: `${style}`}
                            ) as {seq: string; name: string};
                            return (
                                <div key={styleString}>
                                    <div className="styleLabel">
                                        {
                                            lang.FASHION_STYLE[
                                                styleString.toLowerCase()
                                            ]
                                        }
                                        ({styleString})
                                    </div>
                                    {images}
                                </div>
                            );
                        })}
                </div>
            );
        } else {
            return <div></div>;
        }
    };

    return (
        <div className="EditorContainer">
            <SideNavigationBar
                direction={Direction.LEFT}
                isOpen={leftTabStatus}
                isWithContext={activeContext === ContextType.LEFT_NAVBAR}
                renderCompanion={leftSideBarCompanionRender}
                renderContent={leftSideBarRender}
                key="left-side-navigation-bar"
            />
            <SideNavigationBar
                direction={Direction.RIGHT}
                isOpen={guideTabStatus}
                isGuide={true}
                isWithContext={activeContext === ContextType.LEFT_NAVBAR}
                renderCompanion={guideSideBarCompanionRender}
                renderContent={() => renderGuide()}
                key="guide-navigation-bar"
            />
            <div
                className="EditorWrapper"
                onMouseDown={() => ContextManager.switchCtx(ContextType.EDITOR)}
                key="editor-wrapper">
                {projectType === ProjectType.OBJECT_DETECTION && (
                    <EditorTopNavigationBar key="editor-top-navigation-bar" />
                )}
                <Editor
                    size={calculateEditorSize()}
                    imageData={imagesData[activeImageIndex]}
                    key="editor"
                />
                <EditorBottomNavigationBar
                    imageData={imagesData[activeImageIndex]}
                    size={calculateEditorSize()}
                    totalImageCount={imagesData.length}
                    key="editor-bottom-navigation-bar"
                />
            </div>
            <SideNavigationBar
                direction={Direction.RIGHT}
                isOpen={rightTabStatus}
                isWithContext={activeContext === ContextType.RIGHT_NAVBAR}
                renderCompanion={rightSideBarCompanionRender}
                renderContent={rightSideBarRender}
                key="right-side-navigation-bar"
            />
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    windowSize: state.general.windowSize,
    activeImageIndex: state.labels.activeImageIndex,
    imagesData: state.labels.imagesData,
    activeContext: state.general.activeContext,
    projectType: state.general.projectData.type
});

export default connect(mapStateToProps)(EditorContainer);
