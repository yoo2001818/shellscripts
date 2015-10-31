import { createAction } from 'redux-actions';
import { api, GET, POST } from '../middleware/api.js';
import { User } from '../schema/index.js';

export const FETCH = 'USER_FETCH';
export const SET_PROFILE = 'USER_SET_PROFILE';
export const SET_ENABLED = 'USER_SET_ENABLED';
export const SET_EMAIL = 'USER_SET_EMAIL';
export const UPLOAD_PHOTO = 'USER_UPLOAD_PHOTO';

export const fetch = createAction(FETCH,
  username => api(GET, `/users/${username}`),
  username => ({
    replace: {
      users: {
        [username.toLowerCase()]: null
      }
    },
    errors: [404],
    schema: User
  })
);

export const setEnabled = createAction(SET_ENABLED,
  (username, enabled) => api(POST, `/users/${username}/enabled`, {
    body: { enabled }
  }),
  () => ({
    errors: [404],
    schema: User
  })
);

export const setProfile = createAction(SET_PROFILE,
  (username, data) => api(POST, `/users/${username}`, {
    body: data
  }),
  () => ({
    errors: [404],
    schema: User
  })
);

export const setEmail = createAction(SET_EMAIL,
  (username, data) => api(POST, `/users/${username}/email`, {
    body: data
  }),
  () => ({
    errors: [404],
    schema: User
  })
);

export const uploadPhoto = createAction(UPLOAD_PHOTO,
  (username, file) => api(POST, `/users/${username}/photo`, {
    body: {
      x: 0,
      y: 0,
      size: 1000
    },
    files: {
      photo: file
    }
  }),
  () => ({
    schema: User
  })
);

export function load(username = '') {
  return (dispatch, getState) => {
    const { entities: { users } } = getState();
    const user = users[username.toLowerCase()];
    if (user == null || user.id == null) {
      return dispatch(fetch(username));
    }
    return Promise.resolve();
  };
}
