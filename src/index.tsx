import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";

const startingPoint = (
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);

ReactDOM.render(
    startingPoint,
    document.getElementById('root') as HTMLElement
);
serviceWorker.unregister();
