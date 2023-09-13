import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import configureStore from './configureStore';
import { Provider } from 'react-redux';
import { AppInitializer } from './logic/initializer/AppInitializer';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './views/Login/Login';

export const store = configureStore();
AppInitializer.inti();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/login",
    element: <Login/>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);

