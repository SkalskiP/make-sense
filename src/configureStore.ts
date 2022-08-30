import { createStore } from 'redux';
import { rootReducer } from './store';

export default function configureStore() {
    return createStore(
        rootReducer,
        window?.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
}