import { combineReducers } from 'redux';
import {editorReducer} from "./editor/reducer";
import {generalReducer} from "./general/reducer";

export const rootReducer = combineReducers({
    general: generalReducer,
    editor: editorReducer
});

export type AppState = ReturnType<typeof rootReducer>;