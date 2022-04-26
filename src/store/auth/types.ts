import {Action} from '../Actions';

export type AuthData = {
    displayName: string;
    email: string;
    role: string;
    authToken: string;
};

export type AuthState = {
    authData: AuthData;
};

interface UpdateAuthData {
    type: typeof Action.UPDATE_AUTH_DATA;
    payload: {
        authData: AuthData;
    };
}

export type AuthActionTypes = UpdateAuthData;
