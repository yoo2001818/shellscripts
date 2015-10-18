import actionKeys from '../utils/actionKeys.js';
import * as LoadActions from '../actions/load.js';

export default function load(state = {
  completed: 0, total: 0, loading: false,
  updatedAt: 0
}, action, handleErrors = true) {
  const { type } = action;
  let { completed, total, loading, error, updatedAt } = state;
  switch (type) {
  case LoadActions.LOAD:
    if (!loading && (new Date().valueOf() - updatedAt) > 500) {
      completed = 0;
      total = 0;
    }
    total++;
    loading = true;
    return {
      completed, total, loading, error, updatedAt
    };
  case LoadActions.COMPLETE:
    const subAction = action.payload;
    if (handleErrors && subAction && subAction.error) {
      if (subAction.payload && subAction.payload.status &&
        (!subAction.meta || !subAction.meta.errors ||
        !Array.isArray(subAction.meta.errors) ||
        subAction.meta.errors.indexOf(subAction.payload.status) === -1)
      ) {
        // Mark the reducer as severe error
        error = {
          error: subAction.payload.error,
          status: subAction.payload.status,
          type: subAction.type,
          body: subAction.payload.body
        };
      }
    }
    completed++;
    if (completed >= total) {
      /* completed = 0;
      total = 0; */
      updatedAt = new Date().valueOf();
      loading = false;
    }
    return {
      completed, total, loading, error, updatedAt
    };
  case LoadActions.ERROR_DISMISS:
    return {
      completed, total, loading, updatedAt
    };
  }
  return state;
}

export function loadFilter(actions, handleErrors = false) {
  const actionList = actionKeys(actions);
  return (state, action) => {
    if (action.payload == null) return state;
    if (actionList.indexOf(action.payload.type) === -1) return state;
    return load(state, action, handleErrors);
  };
}
