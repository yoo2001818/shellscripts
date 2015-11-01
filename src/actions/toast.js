import { createAction } from 'redux-actions';

export const OPEN = 'TOAST_OPEN';
export const CLOSE = 'TOAST_CLOSE';

export const open = createAction(OPEN,
  data => data
);

export const close = createAction(CLOSE);
