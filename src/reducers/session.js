import * as SessionActions from '../actions/session.js';

export default function session(state = null, action) {
  const { type, payload } = action;
  switch (type) {
    case SessionActions.FETCH:
      return Object.assign({}, payload);
    case SessionActions.LOGIN:
      return Object.assign({}, payload);
    case SessionActions.LOGOUT:
      // Clear session data
      return {};
  }
  return state;
}
