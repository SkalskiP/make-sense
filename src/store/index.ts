import { combineReducers } from 'redux';
import {labelsReducer} from "./labels/reducer";
import {generalReducer} from "./general/reducer";

export const rootReducer = combineReducers({
    general: generalReducer,
    labels: labelsReducer
});

export type AppState = ReturnType<typeof rootReducer>;