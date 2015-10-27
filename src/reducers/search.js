import * as SearchActions from '../actions/search.js';
import { loadFilter } from './load.js';
import pagination from './pagination.js';

const loadReducer = loadFilter(SearchActions);
const listPagination = pagination(SearchActions.FETCH, 'entries');

export default function search(state = {
  load: undefined,
  query: '',
  tempQuery: '',
  list: undefined
}, action) {

  let newState = Object.assign({}, state, {
    load: loadReducer(state.load, action),
    list: listPagination(state.list, action)
  });
  if (!action.payload) return newState;
  const { query } = action.payload;
  switch (action.type) {
  case SearchActions.SET_QUERY:
    // Invalidate result too.
    return Object.assign({}, newState, {
      query,
      tempQuery: query,
      result: undefined
    });
  case SearchActions.SET_TEMP_QUERY:
    return Object.assign({}, newState, {
      tempQuery: query
    });
  }
  return newState;
}
