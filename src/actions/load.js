// Load related actions come here
import { createAction } from 'redux-actions';

export const LOAD = 'LOAD';
export const COMPLETE = 'LOAD_COMPLETE';

export const load = createAction(LOAD);
export const complete = createAction(COMPLETE);
