import React from 'react';
import './App.scss';
import EditorView from "./views/EditorView/EditorView";
import MainView from "./views/MainView/MainView";
import {Route, Switch} from "react-router";

const App: React.FC = () => {
  return (
    <div className="App">
        <Switch>
            <Route exact={true} path="/" component={MainView} />
            <Route exact={true} path="/editor/" component={EditorView} />
        </Switch>
    </div>
  );
};

export default App;
