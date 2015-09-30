// Session related actions come here
import { createAction } from 'redux-actions';
import { api, GET, POST, DELETE } from '../middleware/api.js';

export const FETCH = 'SESSION_FETCH';
export const LOGIN = 'SESSION_LOGIN';
export const LOGOUT = 'SESSION_LOGOUT';
export const LOCAL_SIGNUP = 'SESSION_LOCAL_SIGNUP';
export const OAUTH_SIGNUP = 'SESSION_OAUTH_SIGNUP';
export const METHOD_FETCH = 'SESSION_METHOD_FETCH';
export const CHECK_USERNAME = 'SESSION_CHECK_USERNAME';
export const CHECK_EMAIL = 'SESSION_CHECK_EMAIL';

export const fetch = createAction(FETCH,
  () => api(GET, '/api/session', {}),
  () => ({
    errors: [401]
  }));
export const login = createAction(LOGIN,
  credentials => api(POST, '/api/session/local', credentials),
  (_, meta) => meta);
export const logout = createAction(LOGOUT,
  () => api(DELETE, '/api/session', {}),
  (_, meta) => meta);
export const localSignUp = createAction(LOCAL_SIGNUP,
  credentials => api(POST, '/api/session/local/register', credentials),
  (_, meta) => meta);
export const oAuthSignUp = createAction(OAUTH_SIGNUP,
  // Some weird trick
  () => new Promise(resolve => {
    // Forcefully reset the page after 10s, Because after the request is sent,
    // the user is logged in by the server after some time I suppose
    // By disabling login form, we can force the user to refresh their page
    // (Thus keeping the server and client in sync)
    // But if the user has slow Internet, 10s may not be enough, so we'll just
    // 'lockdown' the page forever
    if (__CLIENT__) {
      /*setTimeout(() => {
        location.reload();
      }, 10000);*/
    } else {
      // If it's a server, resolve the promise immediately to avoid memory leak
      // Although I don't think this will ever be issued by server
      resolve();
    }
  }));
export const methodFetch = createAction(METHOD_FETCH,
  () => api(GET, '/api/session/methods', {}));
export const checkUsername = createAction(CHECK_USERNAME,
  username => api(GET, `/api/users/${username}`),
  () => ({
    errors: [404],
    silent: true
  }));
export const checkEmail = createAction(CHECK_EMAIL,
  email => api(POST, '/api/user/email', { email }));

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
