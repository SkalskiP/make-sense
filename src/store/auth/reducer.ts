import {AuthActionTypes, AuthState} from './types';
import {Action} from '../Actions';

const initialState: AuthState = {
    authData: {
        displayName: null,
        role: null,
        email: null,
        authToken: null
    }
};

export function authReducer(
    state = initialState,
    action: AuthActionTypes
): AuthState {
    switch (action.type) {
        case Action.UPDATE_AUTH_DATA: {
            return {
                ...state,
                authData: action.payload.authData
            };
        }
        default:
            return state;
    }
}
