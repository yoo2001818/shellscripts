import * as EntryActions from '../actions/entry.js';

// TODO pagination

export default function entry(state = {
  list: [],
  lastUpdated: 0
}, action) {
  const { type, payload } = action;
  switch (type) {
  case EntryActions.FETCH_LIST:
    return Object.assign({}, state, {
      list: payload.result,
      lastUpdated: new Date().valueOf()
    });
  }
  return state;
}
