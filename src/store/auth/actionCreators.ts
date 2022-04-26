import {AuthActionTypes, AuthData} from './types';
import {Action} from '../Actions';

export function updateAuthData(authData: AuthData): AuthActionTypes {
    return {
        type: Action.UPDATE_AUTH_DATA,
        payload: {
            authData
        }
    };
}
