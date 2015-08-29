import * as SessionActions from '../actions/session.js';

export default function session(state = {
  loaded: false
}, action) {
  const { type, payload, error } = action;
  switch (type) {
    case SessionActions.FETCH:
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
