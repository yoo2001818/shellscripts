import * as SessionActions from '../actions/session.js';
import { loadFilter } from './load.js';

const loadReducer = loadFilter(SessionActions);

export default function session(state = {
  load: {
    completed: 0, total: 0, loading: false
  },
  loaded: false,
  method: null
}, action) {
  const load = loadReducer(state.load, action);
  let { method } = state;
  const { type, payload, error } = action;
  switch (type) {
    case SessionActions.FETCH:
      // If we have an error in this, we should consider this a fatal error
      if (error && payload.status !== 401) {
        return Object.assign({}, state, {error: true, loaded: true});
      }
      return Object.assign({}, state, error ? null : payload.body, {
        loaded: true,
        load
      });
    case SessionActions.LOGIN:
      if (error) return state;
      return Object.assign({}, state, payload.body, {
        load
      });
    case SessionActions.SIGNUP_FINALIZE:
      if (error) return state;
      return Object.assign({}, state, payload.body, {
        load
      });
    case SessionActions.LOCAL_SIGNUP:
      if (error) return state;
      return Object.assign({}, state, payload.body, {
        load
      });
    case SessionActions.LOGOUT:
      if (error) return state;
      return { load, loaded: true, method };
    case SessionActions.METHOD_FETCH:
      if (error) return state;
      return Object.assign({}, state, {
        load, method: payload.body
      });
  }
  return Object.assign({}, state, {
    load
  });
}
