import React from 'react';
import './EditorContainer.scss';
import {SideNavigationBar} from "../SideNavigationBar/SideNavigationBar";
import {Direction} from "../../../data/Direction";
import EditorWrapper from "../EditorWrapper/EditorWrapper";

const EditorContainer: React.FC = () => {
    return (
        <div className="EditorContainer">
            <SideNavigationBar direction={Direction.LEFT}/>
            <EditorWrapper/>
            <SideNavigationBar direction={Direction.RIGHT}/>
        </div>
    );
};

export default EditorContainer;