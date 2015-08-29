import actionKeys from '../utils/actionKeys.js';
import * as LoadActions from '../actions/load.js';

export default function load(state = {
  completed: 0, total: 0, loading: false
}, action) {
  const { type } = action;
  let { completed, total, loading } = state;
  switch (type) {
    case LoadActions.LOAD:
      total++;
      loading = true;
      return {
        completed, total, loading
      };
    case LoadActions.COMPLETE:
      completed++;
      if (completed >= total) {
        completed = 0;
        total = 0;
        loading = false;
      }
      return {
        completed, total, loading
      };
  }
  return state;
}

export function loadFilter(actions) {
  const actionList = actionKeys(actions);
  return (state, action) => {
    if (action.payload == null) return state;
    if (actionList.indexOf(action.payload.type) === -1) return state;
    return load(state, action);
  };
}
