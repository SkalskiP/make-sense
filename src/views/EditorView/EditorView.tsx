import React from 'react';
import './Editorview.scss';
import {TopNavigationBar} from "./TopNavigationBar/TopNavigationBar";
import EditorContainer from "./EditorContainer/EditorContainer";
import StateBar from "./StateBar/StateBar";

const EditorView: React.FC = () => {
    return (
        <div className="EditorView">
            <StateBar/>
            <TopNavigationBar/>
            <EditorContainer/>
        </div>
    );
};

export default EditorView;