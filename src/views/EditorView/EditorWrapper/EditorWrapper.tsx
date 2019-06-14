import React from 'react';
import './EditorWrapper.scss';
import Editor from "../Editor/Editor";
import BottomNavigationBar from "../BottomNavigationBar/BottomNavigationBar";

const EditorWrapper: React.FC = () => {
    return (
        <div className="EditorWrapper">
            <Editor/>
            <BottomNavigationBar/>
        </div>
    );
};

export default EditorWrapper;