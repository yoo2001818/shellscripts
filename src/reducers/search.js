import * as SearchActions from '../actions/search.js';

export default function search(state = {
  result: null,
  query: '',
  tempQuery: ''
}, action) {
  if (!action.payload) return state;
  const { query } = action.payload;
  switch (action.type) {
    case SearchActions.FETCH:
      break;
    case SearchActions.SET_QUERY:
      // Invalidate result too.
      return Object.assign({}, state, {
        query,
        tempQuery: query,
        result: undefined
      });
    case SearchActions.SET_TEMP_QUERY:
      return Object.assign({}, state, {
        tempQuery: query
      });
  }
  return state;
}
