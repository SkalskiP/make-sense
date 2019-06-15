import React from 'react';
import './App.scss';
import EditorView from "./views/EditorView/EditorView";
import MainView from "./views/MainView/MainView";

const App: React.FC = () => {
  return (
    <div className="App">
      {/*<EditorView/>*/}
      <MainView/>
    </div>
  );
};

export default App;
