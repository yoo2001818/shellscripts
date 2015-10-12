/**
 * Replaces 'payload.entities' to 'meta.replace' if there is an error.
 * Used to process 404 error, etc.
 */
export const injectReplaceMiddleware = () => next => action => {
  if (action == null) return next(action);
  if (!action.error) return next(action);
  const { payload, meta } = action;
  if (meta == null) return next(action);
  if (meta.replace == null) return next(action);
  if (meta.errors && Array.isArray(meta.errors) &&
    meta.errors.indexOf(payload.status) === -1
  ) {
    return next(action);
  }
  return next(Object.assign({}, action, {
    payload: Object.assign({}, payload, {
      entities: meta.replace
    })
  }));
}

export default injectReplaceMiddleware;
