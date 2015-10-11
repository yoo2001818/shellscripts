import { createAction } from 'redux-actions';
import { arrayOf } from 'normalizr';
import { api, GET } from '../middleware/api.js';
import { Entry } from '../schema/index.js';

export const FETCH_LIST = 'ENTRY_FETCH_LIST';

export const fetchList = createAction(FETCH_LIST,
  () => api(GET, '/api/entries/'),
  () => ({
    schema: arrayOf(Entry)
  })
);

export function loadList() {
  return (dispatch, getState) => {
    const { entry: { lastUpdated } } = getState();
    const currentTime = new Date().valueOf();
    // Will use previous information for 5s
    if (currentTime - lastUpdated < 5000) {
      return Promise.resolve();
    }
    // Otherwise, refetch.
    return dispatch(fetchList());
  };
}
