import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import configureStore from "./configureStore";
import {Provider} from "react-redux";
import {updateWindowSize} from "./store/general/actionCreators";

export const store = configureStore();

const handleResize = () => {
    store.dispatch(updateWindowSize({width: window.innerWidth, height: window.innerHeight}));
};

handleResize();
window.addEventListener("resize", handleResize);

const startingPoint = (
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(
    startingPoint,
    document.getElementById('root') as HTMLElement
);
serviceWorker.unregister();
