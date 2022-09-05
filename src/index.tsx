import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import {AppInitializer} from './logic/initializer/AppInitializer';


export const store = configureStore();
AppInitializer.inti();

ReactDOM.render(
    (<Provider store={store}>
        <App/>
    </Provider>),
    document.getElementById('root') || document.createElement('div') // fix for testing purposes
);

serviceWorker.unregister();
