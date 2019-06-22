import { combineReducers } from 'redux';
import {editorReducer} from "./editor/reducer";

export const rootReducer = combineReducers({
    editor: editorReducer
});

export type AppState = ReturnType<typeof rootReducer>;