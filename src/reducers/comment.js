import * as CommentActions from '../actions/comment.js';
import subPagination from './subPagination.js';
import { loadFilter } from './load.js';

const commentLoad = loadFilter(CommentActions);
const listSubPagination =
  subPagination(CommentActions.FETCH_LIST, 'comments');

export default function entry(state = {
  list: {},
  load: undefined
}, action) {
  let newState = Object.assign({}, state, {
    list: listSubPagination(state.list, action),
    load: commentLoad(state.load, action)
  });
  return newState;
}
