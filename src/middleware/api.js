import { load } from '../actions/load.js';

const API_MARKER = 'API_MARKER';

export function api(endpoint, options) {
  return {
    API_MARKER,
    endpoint,
    options
  };
}

export const apiMiddleware = client => store => next => action => {
  if (action == null) return next(action);
  if (action.payload == null) return next(action);
  if (action.payload.API_MARKER !== API_MARKER) return next(action);
  // Client function should return a Promise
  const { endpoint, options } = action.payload;
  let promise = client(endpoint, options);
  if (promise == null) {
    // Dispatch an Error!
    return store.dispatch(Object.assign({}, action, {
      error: true,
      payload: new Error('Client did not return a Promise object')
    }));
  }
  // Dispatch load action
  store.dispatch(load(Object.assign({}, action, {
    promise: promise
  })));
  return store.dispatch(Object.assign({}, action, {
    payload: promise
  }));
};

export default apiMiddleware;
