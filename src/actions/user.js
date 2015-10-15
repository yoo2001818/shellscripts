import { createAction } from 'redux-actions';
import { api, GET, POST } from '../middleware/api.js';
import { User } from '../schema/index.js';

export const FETCH = 'USER_FETCH';
export const SET_PROFILE = 'USER_SET_PROFILE';
export const UPLOAD_PHOTO = 'USER_UPLOAD_PHOTO';

export const fetch = createAction(FETCH,
  username => api(GET, `/api/users/${username}`),
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

export const setProfile = createAction(SET_PROFILE,
  (username, data) => api(POST, `/api/users/${username}`, data),
  () => ({
    errors: [404],
    schema: User
  })
);

export const uploadPhoto = createAction(UPLOAD_PHOTO,
  (username, file) => api(POST, '/api/users/${username}/photo', {
    $multipart: true,
    $fields: {
      x: 0,
      y: 0,
      size: 1000
    },
    $files: {
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
    const userId = users[username.toLowerCase()];
    if (userId == null || users[userId] == null) {
      return dispatch(fetch(username));
    }
    return Promise.resolve();
  };
}
