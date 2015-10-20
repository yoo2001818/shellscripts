import { normalize } from 'normalizr';

export const normalizeMiddleware = store => next => action => {
  if (action == null) return next(action);
  if (action.error) return next(action);
  if (action.meta == null) return next(action);
  if (!action.meta.schema) return next(action);
  const { payload } = action;
  let body = payload;
  if (payload.body) body = payload.body;
  return store.dispatch(Object.assign({}, action, {
    payload: normalize(body, action.meta.schema),
    meta: Object.assign({}, action.meta, {
      // Detach schema information
      schema: undefined
    })
  }));
};

export default normalizeMiddleware;
