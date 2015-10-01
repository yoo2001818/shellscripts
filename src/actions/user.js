import { createAction } from 'redux-actions';
import { api, GET } from '../middleware/api.js';

export const FETCH = 'USER_FETCH';

export const fetch = createAction(FETCH,
  username => api(GET, `/api/users/${username}`),
  username => ({
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
