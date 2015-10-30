import * as ListCartActions from '../actions/listCart.js';

export default function listCart(state = {
  list: [],
  enabled: false
}, action) {
  const { type, payload } = action;

  switch (type) {
  case ListCartActions.ADD:
  case ListCartActions.REMOVE:
  case ListCartActions.SWAP:
    let newList = state.list.slice();
    let newState = Object.assign({}, state, {
      list: newList
    });
    switch (type) {
    case ListCartActions.ADD:
      newList.push(payload);
      return newState;
    case ListCartActions.REMOVE:
      newList.splice(payload, 1);
      return newState;
    case ListCartActions.SWAP:
      newList[payload.from] = state.list[payload.to];
      newList[payload.to] = state.list[payload.from];
      return newState;
    }
    break;
  case ListCartActions.CLEAR:
    return Object.assign({}, state, {
      list: []
    });
  case ListCartActions.ENABLE:
    return Object.assign({}, state, {
      enabled: true,
      list: payload || []
    });
  case ListCartActions.DISABLE:
    return Object.assign({}, state, {
      enabled: false,
      list: []
    });
  }
  return state;
}
