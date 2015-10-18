import * as SessionActions from '../actions/session.js';
import { loadFilter } from './load.js';

const loadReducer = loadFilter(SessionActions);

export default function session(state = {
  load: undefined,
  loaded: false,
  login: null,
  method: null
}, action) {
  const load = loadReducer(state.load, action);
  const newState = Object.assign({}, state, {
    load
  });
  let { method } = state;
  const { type, payload, meta, error } = action;
  let login;
  if (payload) login = payload.result;
  switch (type) {
  case SessionActions.FETCH:
    // If we have an error in this, we should consider this a fatal error
    if (error && payload.status !== 401) {
      return Object.assign({}, state, {error: true, loaded: true});
    }
    return Object.assign({}, newState, {
      loaded: true,
      login: error ? null : login
    });
  case SessionActions.LOGIN:
    if (error) return state;
    return Object.assign({}, newState, {
      login
    });
  case SessionActions.SIGNUP_FINALIZE:
    if (error) return state;
    return Object.assign({}, newState, {
      login
    });
  case SessionActions.LOCAL_SIGNUP:
    if (error) return state;
    return Object.assign({}, newState, {
      login, method: Object.assign({}, state.method, {
        [meta.method]: Object.assign({}, state.method[meta.method], {
          inUse: true
        })
      })
    });
  case SessionActions.LOGOUT:
    if (error) return state;
    return { load, loaded: true, method, login: null };
  case SessionActions.METHOD_FETCH:
    if (error) return state;
    return Object.assign({}, newState, {
      method: payload.body
    });
  case SessionActions.METHOD_DELETE:
    if (error) return state;
    return Object.assign({}, newState, {
      method: Object.assign({}, state.method, {
        [meta.method]: Object.assign({}, state.method[meta.method], {
          inUse: false
        })
      })
    });
  }
  return newState;
}
