import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { api, GET, POST, PUT, DELETE } from '../middleware/api.js';
import { Comment } from '../schema/index.js';
import { open } from './modal.js';

export const FETCH_LIST = 'COMMENT_FETCH_LIST';
export const FETCH = 'COMMENT_FETCH';
export const CREATE = 'COMMENT_CREATE';
export const EDIT_COMMENT = 'COMMENT_EDIT';
export const DELETE_COMMENT = 'COMMENT_DELETE';

export const fetchList = createAction(FETCH_LIST,
  (entry, lastIndex) =>
    api(GET,
      `/api/entries/${entry.author.toLowerCase()}/${entry.name}/comments`,
      {
        query: { lastIndex }
      }),
  (entry, lastIndex, reset) => ({
    schema: arrayOf(Comment),
    name: `${entry.author.toLowerCase()}/${entry.name}`,
    lastIndex, reset,
    errors: [404]
  })
);

export const fetch = createAction(FETCH,
  (entry, id) =>
    api(GET,
      `/api/entries/${entry.author.toLowerCase()}/${entry.name}/comments/${id}`
    ),
  (entry, id) => ({
    replace: {
      comments: {
        [id]: null
      }
    },
    errors: [404],
    schema: Comment
  })
);

export const create = createAction(CREATE,
  (entry, data) =>
    api(POST,
      `/api/entries/${entry.author.toLowerCase()}/${entry.name}/comments`,
      {
        body: data
      }),
  () => ({
    schema: Comment
  })
);

export const edit = createAction(EDIT_COMMENT,
  (entry, data) =>
    api(PUT,
`/api/entries/${entry.author.toLowerCase()}/${entry.name}/comments/${data.id}`,
      {
        body: data
      }),
  () => ({
    schema: Comment
  })
);

export const deleteComment = createAction(DELETE_COMMENT,
  (entry, id) =>
    api(DELETE,
      `/api/entries/${entry.author.toLowerCase()}/${entry.name}/comments/${id}`
    ),
  () => ({
    schema: Comment
  })
);

export function loadList(entry, last) {
  return (dispatch, getState) => {
    const { comment: { list } } = getState();
    const page = list[`${entry.author.toLowerCase()}/${entry.name}`];
    if (page != null && new Date().valueOf() - page.loadedAt < 10000) {
      return Promise.resolve();
    }
    // This is 'refetch'.
    return dispatch(fetchList(entry, last, true));
  };
}

export function loadListMore(entry, forced = false) {
  return (dispatch, getState) => {
    const { comment: { list } } = getState();
    const page = list[`${entry.author.toLowerCase()}/${entry.name}`];
    // Whaaaat
    if (page == null) return dispatch(loadList(entry));
    // If it's already loading, cancel it.
    if (page.load && page.load.loading) return Promise.resolve();
    // If list is null, cancel it.
    if (!forced && page.lastIndex == null) return Promise.resolve();
    return dispatch(fetchList(entry, page.lastIndex));
  };
}

export function load(entry, id) {
  return (dispatch) => {
    // Well, always reload... for now.
    return dispatch(fetch(entry, id));
  };
}

// TODO to be refactored
export function confirmCommentDelete(entry, id) {
  return (dispatch) => {
    dispatch(open({
      title: 'confirmCommentDelete',
      body: {
        translated: 'confirmCommentDeleteDescription'
      },
      choices: [
        {
          name: 'yes',
          type: 'red-button',
          action: deleteComment(entry, id)
        },
        {
          name: 'no'
        }
      ]
    }));
  };
}
