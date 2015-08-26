// User related actions come here
import { createAction } from 'redux-actions';

export const LOGIN = 'USER_LOGIN';
export const LOGOUT = 'USER_LOGOUT';

// TODO: async?
export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);
