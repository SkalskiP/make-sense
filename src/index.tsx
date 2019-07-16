import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from "./configureStore";
import {Provider} from "react-redux";
import {updateMobileDeviceData, updateWindowSize} from "./store/general/actionCreators";
import MobileDetect from 'mobile-detect'

export const store = configureStore();

const handleResize = () => {
    store.dispatch(updateWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
    }));

};
const detectDeviceParams = () => {
    const mobileDetect = new MobileDetect(window.navigator.userAgent);
    store.dispatch(updateMobileDeviceData({
        manufacturer: mobileDetect.mobile(),
        browser: mobileDetect.userAgent(),
        os: mobileDetect.os()
    }))
};

handleResize();
detectDeviceParams();
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
