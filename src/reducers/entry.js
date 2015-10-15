import * as EntryActions from '../actions/entry.js';

// TODO pagination

export default function entry(state = {
  list: [],
  userList: {},
  lastUpdated: 0
}, action) {
  const { type, meta, payload, error } = action;
  switch (type) {
  case EntryActions.FETCH_LIST:
    if (error) return state;
    return Object.assign({}, state, {
      list: payload.result,
      lastUpdated: new Date().valueOf()
    });
  case EntryActions.FETCH_USER_LIST:
    if (error) return state;
    return Object.assign({}, state, {
      userList: Object.assign({}, state.userList, {
        [meta.username.toLowerCase()]: payload.result
      })
    });
  }
  return state;
}
