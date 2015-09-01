import * as SearchActions from '../actions/search.js';
import { loadFilter } from './load.js';

const loadReducer = loadFilter(SearchActions);

export default function search(state = {
  load: {
    completed: 0, total: 0, loading: false
  },
  result: null,
  query: '',
  tempQuery: ''
}, action) {
  const load = loadReducer(state.load, action);
  if (!action.payload) return Object.assign({}, state, { load });
  const { query } = action.payload;
  switch (action.type) {
    case SearchActions.FETCH:
      break;
    case SearchActions.SET_QUERY:
      // Invalidate result too.
      return Object.assign({}, state, {
        query,
        tempQuery: query,
        result: undefined,
        load
      });
    case SearchActions.SET_TEMP_QUERY:
      return Object.assign({}, state, {
        tempQuery: query,
        load
      });
  }
  return Object.assign({}, state, { load });
}
