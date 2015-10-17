import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { api, GET, POST, PUT, DELETE } from '../middleware/api.js';
import { Entry } from '../schema/index.js';
import { open } from './modal.js';

export const FETCH_LIST = 'ENTRY_FETCH_LIST';
export const FETCH_USER_LIST = 'ENTRY_FETCH_USER_LIST';
export const FETCH = 'ENTRY_FETCH';
export const CREATE = 'ENTRY_CREATE';
export const EDIT_ENTRY = 'ENTRY_EDIT';
export const DELETE_ENTRY = 'ENTRY_DELETE';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/api/entries/'),
  () => ({
    schema: arrayOf(Entry)
  })
);

export const fetchUserList = createAction(FETCH_USER_LIST,
  (username) => api(GET, `/api/entries/${username}`),
  (username) => ({
    schema: arrayOf(Entry),
    username
  })
);

export const fetch = createAction(FETCH,
  (username, name) => api(GET, `/api/entries/${username}/${name}`),
  (username, name) => ({
    replace: {
      entries: {
        // I've heard that `` strings don't work in here.
        [username.toLowerCase() + '/' + name.toLowerCase()]: null
      }
    },
    errors: [404],
    schema: Entry
  })
);

export const create = createAction(CREATE,
  (data) => api(POST, `/api/entries/${data.author}/${data.name}`,
    Object.assign({}, data, {
      type: 'script'
    })),
  () => ({
    schema: Entry
  })
);

export const edit = createAction(EDIT_ENTRY,
  (data) => api(PUT, `/api/entries/${data.author}/${data.name}`,
    Object.assign({}, data, {
      type: 'script'
    })),
  () => ({
    schema: Entry
  })
);

export const deleteEntry = createAction(DELETE_ENTRY,
  (data) => api(DELETE, `/api/entries/${data.author}/${data.name}`),
  () => ({
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

export function confirmEntryDelete(entry) {
  return (dispatch) => {
    dispatch(open({
      title: 'confirmEntryDelete',
      body: {
        translated: 'confirmEntryDeleteDescription',
        props: [
          entry.title
        ]
      },
      choices: [
        {
          name: 'yes',
          type: 'red-button',
          action: deleteEntry(entry)
        },
        {
          name: 'no'
        }
      ]
    }));
  };
}
