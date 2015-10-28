import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { api, GET, POST, PUT, DELETE } from '../middleware/api.js';
import { Entry } from '../schema/index.js';
import { open } from './modal.js';

export const FETCH_LIST = 'ENTRY_FETCH_LIST';
export const FETCH_USER_LIST = 'ENTRY_FETCH_USER_LIST';
export const FETCH_USER_STARRED_LIST = 'ENTRY_FETCH_USER_STARRED_LIST';
export const FETCH = 'ENTRY_FETCH';
export const CREATE = 'ENTRY_CREATE';
export const EDIT_ENTRY = 'ENTRY_EDIT';
export const DELETE_ENTRY = 'ENTRY_DELETE';
export const STAR = 'ENTRY_STAR';
export const UNSTAR = 'ENTRY_UNSTAR';

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
  (username, lastIndex) => api(GET, `/api/entries/${username}`, {
    query: { lastIndex }
  }),
  (username, lastIndex, reset) => ({
    schema: arrayOf(Entry),
    lastIndex, reset, name: username.toLowerCase(),
    errors: [404]
  })
);

export const fetchUserStarredList = createAction(FETCH_USER_STARRED_LIST,
  (username, lastIndex) => api(GET, `/api/users/${username}/starred`, {
    query: { lastIndex }
  }),
  (username, lastIndex, reset) => ({
    schema: arrayOf(Entry),
    lastIndex, reset, name: username.toLowerCase(),
    errors: [404]
  })
);

export const fetch = createAction(FETCH,
  (username, name) => api(GET, `/api/entries/${username}/${name}`),
  (username, name, silent = false) => ({
    replace: {
      entries: {
        // I've heard that `` strings don't work in here.
        [username.toLowerCase() + '/' + name.toLowerCase()]: null
      }
    },
    errors: [404],
    schema: Entry,
    silent
  })
);

export const create = createAction(CREATE,
  (data) => api(POST, `/api/entries/${data.author}/${data.name}`, {
    body: data
  }),
  () => ({
    schema: Entry
  })
);

export const edit = createAction(EDIT_ENTRY,
  (data) => api(PUT, `/api/entries/${data.author}/${data.name}`, {
    body: data
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

export const star = createAction(STAR,
  (username, name) => api(POST, `/api/entries/${username}/${name}/stars`),
  () => ({
    schema: Entry
  })
);

export const unstar = createAction(UNSTAR,
  (username, name) => api(DELETE, `/api/entries/${username}/${name}/stars`),
  () => ({
    schema: Entry
  })
);

export function loadList(last) {
  return (dispatch, getState) => {
    const { entry: { list } } = getState();
    if (list != null && new Date().valueOf() - list.loadedAt < 10000) {
      return Promise.resolve();
    }
    // This is 'refetch'.
    return dispatch(fetchList(last, true));
  };
}

export function loadListMore() {
  return (dispatch, getState) => {
    const { entry: { list } } = getState();
    // Uhh what
    if (list == null) return dispatch(loadList());
    // If it's already loading, cancel it.
    if (list.load && list.load.loading) return Promise.resolve();
    // If list is null, cancel it.
    if (list.lastIndex == null) return Promise.resolve();
    return dispatch(fetchList(list.lastIndex));
  };
}

export function loadUserList(username, last) {
  return (dispatch, getState) => {
    const { entry: { userList } } = getState();
    const list = userList[username.toLowerCase()];
    if (list != null && new Date().valueOf() - list.loadedAt < 20000) {
      return Promise.resolve();
    }
    return dispatch(fetchUserList(username, last, true));
  };
}

export function loadUserListMore(username) {
  return (dispatch, getState) => {
    const { entry: { userList } } = getState();
    const list = userList[username.toLowerCase()];
    // Uhh what
    if (list == null) return dispatch(loadUserList(username));
    // If it's already loading, cancel it.
    if (list && list.load && list.load.loading) return Promise.resolve();
    // If list is null, cancel it.
    if (list.lastIndex == null) return Promise.resolve();
    return dispatch(fetchUserList(username, list && list.lastIndex));
  };
}

export function loadUserStarredList(username, last) {
  return (dispatch, getState) => {
    const { entry: { userStarredList } } = getState();
    const list = userStarredList[username.toLowerCase()];
    if (list != null && new Date().valueOf() - list.loadedAt < 20000) {
      return Promise.resolve();
    }
    return dispatch(fetchUserStarredList(username, last, true));
  };
}

export function loadUserStarredListMore(username) {
  return (dispatch, getState) => {
    const { entry: { userStarredList } } = getState();
    const list = userStarredList[username.toLowerCase()];
    // Uhh what
    if (list == null) return dispatch(loadUserStarredList(username));
    // If it's already loading, cancel it.
    if (list && list.load && list.load.loading) return Promise.resolve();
    // If list is null, cancel it.
    if (list.lastIndex == null) return Promise.resolve();
    return dispatch(fetchUserStarredList(username, list && list.lastIndex));
  };
}

export function load(username, name, silent) {
  return (dispatch, getState) => {
    const { entities: { entries } } = getState();
    const entry = entries[username.toLowerCase() + '/' + name.toLowerCase()];
    if (entry != null && entry.description !== undefined &&
      new Date().valueOf() - entry.loadedAt < 20000
    ) {
      return Promise.resolve();
    }
    // Well, always reload... for now.
    return dispatch(fetch(username, name, silent));
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
