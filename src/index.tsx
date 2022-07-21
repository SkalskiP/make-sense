import React from 'react';
import './index.scss';
import App from './App';
import configureStore from './configureStore';
import { Provider } from 'react-redux';
import { AppInitializer } from './logic/initializer/AppInitializer';


export const store = configureStore();
AppInitializer.inti();

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root') || document.createElement("div");
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);


import * as serviceWorker from './serviceWorker';
serviceWorker.unregister();
