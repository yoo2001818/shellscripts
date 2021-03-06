// Search related actions come here
import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { api, GET } from '../middleware/api.js';
import { Entry } from '../schema/index.js';

export const FETCH = 'SEARCH_FETCH';
export const SET_QUERY = 'SEARCH_SET_QUERY';
export const SET_TEMP_QUERY = 'SEARCH_SET_TEMP_QUERY';

export const fetch = createAction(FETCH,
  (keyword, props) => api(GET, '/entries/', {
    query: Object.assign({}, props, {
      keyword
    })
  }),
  (keyword, props, reset) => ({
    schema: arrayOf(Entry),
    order: props.order,
    reset
  })
);
export const forceSetQuery = createAction(SET_QUERY);
export const setTempQuery = createAction(SET_TEMP_QUERY);

export function loadList(last, order) {
  return (dispatch, getState) => {
    const { search: { list, query } } = getState();
    return dispatch(fetch(query, {
      lastIndex: last,
      order: order || (list && list.order) || 'id'
    }, true));
  };
}

export function loadListMore() {
  return (dispatch, getState) => {
    const { search: { list, query } } = getState();
    // Uhh what
    if (list == null) return dispatch(loadList());
    // If it's already loading, cancel it.
    if (list.load && list.load.loading) return Promise.resolve();
    // If list is null, cancel it.
    // if (list.lastIndex == null) return Promise.resolve();
    return dispatch(fetch(query, {
      lastIndex: list.lastIndex,
      lastValue: list.lastValue,
      order: list.order
    }));
  };
}

export function setQuery(payload) {
  return (dispatch, getState) => {
    const { search: { query } } = getState();
    const { history } = payload;
    // Issue a transition if router is present
    // This looks bad. I should use redux-router
    if (query === payload.query) {
      if (history) {
        history.pushState({}, '/search', {
          query: payload.query
        });
      }
      return Promise.resolve();
    }
    dispatch(forceSetQuery({
      query: payload.query
    }));
    if (history) {
      history.pushState({}, '/search', {
        query: payload.query
      });
    }
    if (payload.query === '' || payload.query == null) return Promise.resolve();
    return dispatch(loadList(payload.query));
  };
}
