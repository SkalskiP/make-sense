import { combineReducers } from 'redux';
import {labelsReducer} from './labels/reducer';
import {generalReducer} from './general/reducer';
import {aiReducer} from './ai/reducer';
import {notificationsReducer} from './notifications/reducer';

const combinedReducer = combineReducers({
    general: generalReducer,
    labels: labelsReducer,
    ai: aiReducer,
    notifications: notificationsReducer
});

export type AppState = ReturnType<typeof combinedReducer>;
export function rootReducer(state:AppState|undefined, action:any):AppState {
    if(action.type==='RESTORE_LOCAL_PROJECT' && state) {
        return {...state,labels:action.payload.labels,general:{...state.general,
            projectData:action.payload.project,activePopupType:null,imageDragMode:false,zoom:1},
            ai:aiReducer(undefined,{type:'@@INIT'} as any)};
    }
    return combinedReducer(state,action);
}
