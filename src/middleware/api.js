export const API = 'apiRequest';

export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';
export const PUT = 'PUT';

export function api(method, endpoint, options) {
  return {
    [API]: true,
    method,
    endpoint,
    options
  };
}

export const apiMiddleware = client => store => next => action => {
  if (action == null) return next(action);
  if (action.payload == null) return next(action);
  if (!action.payload[API]) return next(action);
  // Client function should return a Promise
  let { endpoint } = action.payload;
  const { method, options } = action.payload;
  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }
  let promise = client(method, endpoint, options);
  if (promise == null) {
    // Dispatch an Error!
    return store.dispatch(Object.assign({}, action, {
      error: true,
      payload: new Error('Client did not return a Promise object')
    }));
  }
  return store.dispatch(Object.assign({}, action, {
    payload: promise
  }));
};

export default apiMiddleware;
