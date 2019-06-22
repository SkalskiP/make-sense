import React, {useState} from 'react';
import './EditorContainer.scss';
import {SideNavigationBar} from "../SideNavigationBar/SideNavigationBar";
import {Direction} from "../../../data/Direction";
import EditorWrapper from "../EditorWrapper/EditorWrapper";
import {VerticalEditorButton} from "../VerticalEditorButton/VerticalEditorButton";

const EditorContainer: React.FC = () => {
    const [leftTabStatus, setLeftTabStatus] = useState(true);
    const [rightTabStatus, setRightTabStatus] = useState(true);

    return (
        <div className="EditorContainer">
            <SideNavigationBar
                direction={Direction.LEFT}
                isOpen={leftTabStatus}
            >
                <VerticalEditorButton
                    label="Images"
                    image={"/ico/files.png"}
                    imageAlt={"images"}
                    onClick={() => setLeftTabStatus(!leftTabStatus)}
                    isActive={leftTabStatus}
                />
            </SideNavigationBar>
            <EditorWrapper/>
            <SideNavigationBar
                direction={Direction.RIGHT}
                isOpen={rightTabStatus}
            >
                <VerticalEditorButton
                    label="Labels"
                    image={"/ico/tags.png"}
                    imageAlt={"labels"}
                    onClick={() => setRightTabStatus(!rightTabStatus)}
                    isActive={rightTabStatus}
                />
            </SideNavigationBar>
        </div>
    );
};

export default EditorContainer;