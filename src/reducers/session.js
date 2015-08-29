import * as SessionActions from '../actions/session.js';
import { loadFilter } from './load.js';

const loadReducer = loadFilter(SessionActions);

export default function session(state = {
  load: {
    completed: 0, total: 0, loading: false
  },
  loaded: false
}, action) {
  const load = loadReducer(state.load, action);
  const { type, payload, error } = action;
  switch (type) {
    case SessionActions.FETCH:
      // If we have an error in this, we should consider this a fatal error
      if (error) return Object.assign({}, state, {error: true});
      return Object.assign({}, state, payload, {
        loaded: true,
        logged: false,
        load
      });
    case SessionActions.LOGIN:
      if (error) return state;
      return Object.assign({}, state, payload, {
        logged: true,
        load
      });
    case SessionActions.LOGOUT:
      if (error) return state;
      return Object.assign({}, state, payload, {
        logged: false,
        load
      });
  }
  return Object.assign({}, state, {
    load
  });
}
