import React from 'react';
import './App.scss';
import EditorView from "./views/EditorView/EditorView";
import MainView from "./views/MainView/MainView";
import {ProjectType} from "./data/ProjectType";
import {AppState} from "./store";
import {connect} from "react-redux";

interface IProps {
    projectType: ProjectType;
}

const App: React.FC<IProps> = ({projectType}) => {
    const selectRoute = () => {
        if (!projectType)
            return <MainView/>;
        else
            return <EditorView/>;
    };

      return (
        <div className="App">
            {selectRoute()}
        </div>
      );
};

const mapStateToProps = (state: AppState) => ({
    projectType: state.editor.projectType
});

export default connect(
    mapStateToProps
)(App);
