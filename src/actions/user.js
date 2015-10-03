import { createAction } from 'redux-actions';
import { api, GET, POST } from '../middleware/api.js';

export const FETCH = 'USER_FETCH';
export const SET_PROFILE = 'USER_SET_PROFILE';
export const UPLOAD_PHOTO = 'USER_UPLOAD_PHOTO';

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

export const uploadPhoto = createAction(UPLOAD_PHOTO,
  file => api(POST, '/api/user/photo', {
    $multipart: true,
    $fields: {
      x: 0,
      y: 0,
      size: 1000
    },
    $files: {
      photo: file
    }
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
