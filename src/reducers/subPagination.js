import pagination from './pagination.js';

export default function subPagination(actionType, entityType) {
  const builtPagination = pagination(actionType, entityType);
  return function updateSubPagination(state = {}, action) {
    const { meta, payload } = action;
    if (meta && meta.name) {
      return Object.assign({}, state, {
        [meta.name]: builtPagination(state[meta.name], action)
      });
    }
    if (payload && payload.meta && payload.meta.name) {
      return Object.assign({}, state, {
        [payload.meta.name]: builtPagination(state[payload.meta.name], action)
      });
    }
    return state;
  };
}
