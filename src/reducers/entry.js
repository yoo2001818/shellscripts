import * as EntryActions from '../actions/entry.js';

// TODO pagination

export default function entry(state = {
  list: [],
  lastUpdated: 0
}, action) {
  const { type, payload, error } = action;
  switch (type) {
  case EntryActions.FETCH_LIST:
    if (error) return state;
    return Object.assign({}, state, {
      list: payload.result,
      lastUpdated: new Date().valueOf()
    });
  }
  return state;
}
