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
        [username]: null
      }
    },
    errors: [404],
    schema: User
  })
);

export const setProfile = createAction(SET_PROFILE,
  // This always modifies user itself for now
  // TODO Implement set profile if admin
  (username, data) => api(POST, `/api/user`, data),
  () => ({
    errors: [404],
    schema: User
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
