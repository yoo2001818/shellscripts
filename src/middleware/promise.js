import { load, complete } from '../actions/load.js';
import { isFSA } from 'flux-standard-action';

// Copied from redux-promise, I had to set up hooks for Promises.

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware(store) {
  let { dispatch } = store;
  return next => action => {
    // Ignore non-FSA
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }
    if (isPromise(action.payload)) {
      // Dispatch load action
      if (!action.meta || !action.meta.silent) {
        dispatch(load(Object.assign({}, action, {
          payload: null // TODO Think a way to dispatch with a payload?
        })));
      }
      return action.payload.then(
        result => dispatch(Object.assign({}, action, { payload: result })),
        error => dispatch(Object.assign({}, action, {
          payload: error,
          error: true
        }))
      ).then(result => {
        if (!action.meta || !action.meta.silent) {
          dispatch(complete(result));
        }
        return result;
      });
    }
    return next(action);
  };
}
