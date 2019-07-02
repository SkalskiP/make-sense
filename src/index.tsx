import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
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
        <App/>
    </Provider>
);

ReactDOM.render(
    startingPoint,
    document.getElementById('root') as HTMLElement
);
serviceWorker.unregister();
