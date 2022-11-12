import { createStore } from 'redux';
import { rootReducer } from './store';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__: any;
    }
}

export default function configureStore() {
    return createStore(
        rootReducer,
        window?.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
}