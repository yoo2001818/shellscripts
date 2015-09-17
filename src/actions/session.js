// Session related actions come here
import { createAction } from 'redux-actions';
import { api, GET, POST, DELETE } from '../middleware/api.js';

export const FETCH = 'SESSION_FETCH';
export const LOGIN = 'SESSION_LOGIN';
export const LOGOUT = 'SESSION_LOGOUT';
export const LOCAL_SIGNUP = 'SESSION_LOCAL_SIGNUP';
export const METHOD_FETCH = 'SESSION_METHOD_FETCH';

export const fetch = createAction(FETCH,
  () => api(GET, '/api/session', {}));
export const login = createAction(LOGIN,
  credentials => api(POST, '/api/session/local', credentials),
  (_, meta) => meta);
export const logout = createAction(LOGOUT,
  () => api(DELETE, '/api/session', {}),
  (_, meta) => meta);
export const localSignUp = createAction(LOCAL_SIGNUP,
  credentials => api(POST, '/api/session/local/register', credentials),
  (_, meta) => meta);
export const methodFetch = createAction(METHOD_FETCH,
  () => api(GET, '/api/session/method', {}));

export function load() {
  return (dispatch, getState) => {
    const session = getState().session;
    if (!session.loaded) return dispatch(fetch());
    return Promise.resolve();
  };
}

export function methodLoad() {
  return (dispatch, getState) => {
    const { method } = getState().session;
    if (!method) return dispatch(methodFetch());
    return Promise.resolve();
  };
}
