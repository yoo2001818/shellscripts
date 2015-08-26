// Simple example of reducers.

import * as UserActions from '../actions/user.js';

export function user(state = {loggedIn: false}, action) {
  const { type } = action;
  switch (type) {
    case UserActions.LOGIN:
      return Object.assign({}, state, {
        loggedIn: true
      });
    case UserActions.LOGOUT:
      return Object.assign({}, state, {
        loggedIn: false
      });
  }
  return action;
}
