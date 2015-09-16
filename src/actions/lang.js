import { createAction } from 'redux-actions';

// If we support more than 3 languages, We'll need to load language datas from
// the server. But 2 languages are okay to embed into the client script file
// I suppose.

export const SET = 'LANG_SET';

export const set = createAction(SET);