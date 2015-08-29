import * as SessionActions from '../actions/session.js';

export default function session(state = {
  loaded: false
}, action) {
  const { type, payload, error } = action;
  switch (type) {
    case SessionActions.FETCH:
      // If we have an error in this, we should consider this a fatal error
      if (error) return {loaded: true, error: true};
      return Object.assign({}, state, payload, {
        loaded: true,
        logged: false
      });
    case SessionActions.LOGIN:
      if (error) return state;
      return Object.assign({}, state, payload, {
        logged: true
      });
    case SessionActions.LOGOUT:
      if (error) return state;
      return Object.assign({}, state, payload, {
        logged: false
      });
  }
  return state;
}
