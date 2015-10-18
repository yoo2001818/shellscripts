import * as EntryActions from '../actions/entry.js';
import pagination from './pagination.js';

const listPagination = pagination(EntryActions.FETCH_LIST, 'entries');

export default function entry(state = {
  list: undefined,
  userList: {}
}, action) {
  let newState = Object.assign({}, state, {
    list: listPagination(state.list, action)
  });
  const { type, meta, payload, error } = action;
  switch (type) {
  case EntryActions.FETCH_USER_LIST:
    if (error) return state;
    return Object.assign({}, newState, {
      userList: Object.assign({}, state.userList, {
        [meta.username.toLowerCase()]: payload.result
      })
    });
  }
  return newState;
}
