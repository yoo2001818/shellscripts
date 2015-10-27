import { createAction } from 'redux-actions';
import { api, GET, POST } from '../middleware/api.js';

// If we support more than 3 languages, We'll need to load language datas from
// the server. But 2 languages are okay to embed into the client script file
// I suppose.

export const SET = 'LANG_SET';

export const set = createAction(SET);
export const get = createAction(SET, () => api(GET, '/api/lang'));
export const save = createAction(SET,
  lang => api(POST, '/api/lang/', {
    body: { lang }
  })
);
