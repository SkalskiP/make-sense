import React from 'react';
import './Editorview.scss';
import {TopNavigationBar} from "./TopNavigationBar/TopNavigationBar";
import EditorContainer from "./EditorContainer/EditorContainer";

const EditorView: React.FC = () => {
    return (
        <div className="EditorView">
            <TopNavigationBar/>
            <EditorContainer/>
        </div>
    );
};

export default EditorView;