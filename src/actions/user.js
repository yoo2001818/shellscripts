// User related actions come here
import { createAction } from 'redux-actions';
import { api } from '../middleware/api.js';

export const LOGIN = 'USER_LOGIN';
export const LOGOUT = 'USER_LOGOUT';

export const login = createAction(LOGIN,
  credentials => api('/login', credentials));
export const logout = createAction(LOGOUT,
  () => api('/logout', {}));
