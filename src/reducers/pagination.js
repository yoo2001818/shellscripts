import { loadFilter } from './load.js';

export default function pagination(actionType, entityType) {
  const paginationLoad = loadFilter({ actionType });
  return function updatePagination(state = {
    // load would be come here I suppose
    lastIndex: null,
    firstIndex: null,
    // I think pageCount is meaningless.
    pageCount: 0,
    finished: false,
    ids: [],
    load: undefined,
    loadedAt: 0
  }, action) {
    let newState = Object.assign({}, state, {
      load: paginationLoad(state.load, action),
      loadedAt: new Date().valueOf()
    });
    const { meta, payload, type } = action;
    switch (type) {
    case actionType:
      if (action.error) return newState;
      const entities = payload.entities[entityType];
      if (payload.result.length === 0) {
        // End of pagination - there's no entities to load.
        return Object.assign({}, newState, {
          finished: true
        });
      }
      return Object.assign({}, newState, {
        firstIndex: Math.max(state.firstIndex, entities[payload.result[0]].id),
        lastIndex: entities[payload.result[payload.result.length - 1]].id,
        pageCount: meta.reset ? 1 : state.pageCount + 1,
        finished: false,
        // Prehaps we should sort it?
        ids: meta.reset ? payload.result : state.ids.concat(payload.result)
      });
    default:
      return newState;
    }
  };
}
