import { loadFilter } from './load.js';

export default function pagination(actionType, entityType) {
  const paginationLoad = loadFilter({ actionType });
  return function updatePagination(state = {
    // load would be come here I suppose
    lastIndex: null,
    lastValue: null,
    firstIndex: null,
    // I think pageCount is meaningless.
    pageCount: 0,
    finished: false,
    ids: [],
    load: undefined,
    order: 'id',
    loadedAt: 0
  }, action) {
    let newState = Object.assign({}, state, {
      load: paginationLoad(state.load, action)
    });
    const { meta, payload, type } = action;
    const order = (meta && meta.order) || state.order;
    switch (type) {
    case actionType:
      if (action.error) return newState;
      const entities = payload.entities[entityType];
      if (payload.result.length === 0) {
        // End of pagination - there's no entities to load.
        return Object.assign({}, newState, {
          ids: meta.reset ? payload.result : state.ids,
          finished: true,
          loadedAt: new Date().valueOf()
        });
      }
      const lastEntry = entities[payload.result[payload.result.length - 1]];
      let lastValue = lastEntry.stars;
      if (order === 'report') {
        lastValue = lastEntry.reports;
      }
      return Object.assign({}, newState, {
        firstIndex: Math.max(state.firstIndex,
          entities[payload.result[0]].id),
        lastIndex: lastEntry.id,
        lastValue: lastValue,
        pageCount: meta.reset ? 1 : state.pageCount + 1,
        finished: false,
        // Prehaps we should sort it?
        ids: meta.reset ? payload.result : state.ids.concat(payload.result),
        loadedAt: new Date().valueOf(),
        order: order
      });
    default:
      return newState;
    }
  };
}
