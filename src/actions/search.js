// Search related actions come here
import { createAction } from 'redux-actions';
import { api, GET } from '../middleware/api.js';

export const FETCH = 'SEARCH_FETCH';
export const SET_QUERY = 'SEARCH_SET_QUERY';
export const SET_TEMP_QUERY = 'SEARCH_SET_TEMP_QUERY';

export const fetch = createAction(FETCH,
  () => api(GET, '/api/search', {}));
export const forceSetQuery = createAction(SET_QUERY);
export const setTempQuery = createAction(SET_TEMP_QUERY);

export function setQuery(payload) {
  return (dispatch, getState) => {
    const { search: { query } } = getState();
    const { router } = payload;
    // Issue a transition if router is present
    // This looks bad. I should use redux-router
    if (query === payload.query) {
      if (router) {
        router.transitionTo('/search', {}, {
          query: payload.query
        });
      }
      return Promise.resolve();
    }
    dispatch(forceSetQuery({
      query: payload.query
    }));
    if (router) {
      router.transitionTo('/search', {}, {
        query: payload.query
      });
    }
    return dispatch(fetch({
      query: payload.query
    }));
  };
}
