import {store} from '../..';
import {AuthData} from '../auth/types';

export class AuthSelector {
    public static getToken(): string {
        return store.getState().auth.authData.authToken;
    }
    public static getAuthData(): AuthData {
        return store.getState().auth.authData;
    }
    public static getUserID(): string {
        return store.getState().auth.authData.email;
    }
}
