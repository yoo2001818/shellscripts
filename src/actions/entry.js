import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { api, GET } from '../middleware/api.js';
import { Entry } from '../schema/index.js';

export const FETCH_LIST = 'ENTRY_FETCH_LIST';
export const FETCH = 'ENTRY_FETCH';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/api/entries/'),
  () => ({
    schema: arrayOf(Entry)
  })
);

export const fetch = createAction(FETCH,
  (username, name) => api(GET, `/api/entries/${username}/${name}`),
  (username, name) => ({
    replace: {
      entries: {
        // I've heard that `` strings don't work in here.
        [username + '/' + name]: null
      }
    },
    errors: [404],
    schema: Entry
  })
);

export function loadList() {
  return (dispatch, getState) => {
    const { entry: { lastUpdated } } = getState();
    const currentTime = new Date().valueOf();
    // Will use previous information for 5s
    if (currentTime - lastUpdated < 5000) {
      return Promise.resolve();
    }
    // Otherwise, refetch.
    return dispatch(fetchList());
  };
}

export function load(username, name) {
  return (dispatch) => {
    // Well, always reload... for now.
    return dispatch(fetch(username, name));
  };
}
