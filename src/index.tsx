import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App';
import configureStore from './configureStore';
import { Provider } from 'react-redux';
import { AppInitializer } from './logic/initializer/AppInitializer';


export const store = configureStore();
AppInitializer.inti();

const root = createRoot(document.getElementById('root') || document.createElement("div"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);


// import * as serviceWorker from './serviceWorker';
// serviceWorker.unregister();
