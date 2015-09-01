import * as SearchActions from '../actions/search.js';

export default function search(state = {
  result: null,
  query: '',
  tempQuery: '',
  loaded: false
}, action) {
  if (!action.payload) return state;
  const { query } = action.payload;
  switch (action.type) {
    case SearchActions.FETCH:

      break;
    case SearchActions.SET_QUERY:
      return Object.assign({}, state, {
        query,
        tempQuery: query
      });
    case SearchActions.SET_TEMP_QUERY:
      return Object.assign({}, state, {
        tempQuery: query
      });
  }
  return state;
}
