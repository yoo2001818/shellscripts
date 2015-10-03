import { createAction } from 'redux-actions';
import { api, GET, POST } from '../middleware/api.js';

export const FETCH = 'USER_FETCH';
export const SET_PROFILE = 'USER_SET_PROFILE';

export const fetch = createAction(FETCH,
  username => api(GET, `/api/users/${username}`),
  username => ({
    username,
    errors: [404]
  })
);

export const setProfile = createAction(SET_PROFILE,
  // This always modifies user itself for now
  // TODO Implement set profile if admin
  (username, data) => api(POST, `/api/user`, data),
  (username) => ({
    username,
    errors: [404]
  })
);

export function load(username = '') {
  return (dispatch, getState) => {
    const { user } = getState();
    const userId = user.usernames[username.toLowerCase()];
    if (userId == null || user.entities[userId] == null) {
      return dispatch(fetch(username));
    }
    return Promise.resolve();
  };
}
