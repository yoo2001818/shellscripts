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
  lastIndex => api(GET, '/api/entries/', {
    query: { lastIndex }
  }),
  (lastIndex, reset) => ({
    schema: arrayOf(Entry),
    lastIndex, reset
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
  (data) => api(POST, `/api/entries/${data.author}/${data.name}`, {
    body: Object.assign({}, data, {
      type: 'script'
    })
  }),
  () => ({
    schema: Entry
  })
);

export const edit = createAction(EDIT_ENTRY,
  (data) => api(PUT, `/api/entries/${data.author}/${data.name}`, {
    body: Object.assign({}, data, {
      type: 'script'
    })
  }),
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

export function loadList(last) {
  return (dispatch) => {
    // This is 'refetch'.
    return dispatch(fetchList(last, true));
  };
}

export function loadListMore() {
  return (dispatch, getState) => {
    const { entry: { list } } = getState();
    // If it's already loading, cancel it.
    if (list.load.loading) return Promise.resolve();
    return dispatch(fetchList(list.lastIndex));
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
