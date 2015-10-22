import * as EntryActions from '../actions/entry.js';
import pagination from './pagination.js';
import subPagination from './subPagination.js';
import { loadFilter } from './load.js';

const entryLoad = loadFilter(EntryActions);
const listPagination = pagination(EntryActions.FETCH_LIST, 'entries');
const listSubPagination =
  subPagination(EntryActions.FETCH_USER_LIST, 'entries');

export default function entry(state = {
  list: undefined,
  userList: {},
  load: undefined
}, action) {
  let newState = Object.assign({}, state, {
    list: listPagination(state.list, action),
    userList: listSubPagination(state.userList, action),
    load: entryLoad(state.load, action)
  });
  return newState;
}
