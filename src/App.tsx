import React from 'react';
import './App.scss';
import EditorView from "./views/EditorView/EditorView";

const App: React.FC = () => {
  return (
    <div className="App">
      <EditorView/>
    </div>
  );
};

export default App;
