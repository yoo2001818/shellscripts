import * as EntryActions from '../actions/entry.js';
import pagination from './pagination.js';
import subPagination from './subPagination.js';

const listPagination = pagination(EntryActions.FETCH_LIST, 'entries');
const listSubPagination =
  subPagination(EntryActions.FETCH_USER_LIST, 'entries');

export default function entry(state = {
  list: undefined,
  userList: {}
}, action) {
  let newState = Object.assign({}, state, {
    list: listPagination(state.list, action),
    userList: listSubPagination(state.userList, action)
  });
  return newState;
}
