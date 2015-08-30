// Load related actions come here
import { createAction } from 'redux-actions';

export const LOAD = 'LOAD';
export const COMPLETE = 'LOAD_COMPLETE';
export const ERROR_DISMISS = 'ERROR_DISMISS';

export const load = createAction(LOAD);
export const complete = createAction(COMPLETE);
export const errorDismiss = createAction(ERROR_DISMISS);
