import { createAction } from 'redux-actions';

export const ADD = 'LIST_CART_ADD';
export const REMOVE = 'LIST_CART_REMOVE';
export const SWAP = 'LIST_CART_SWAP';
export const CLEAR = 'LIST_CART_CLEAR';

export const ENABLE = 'LIST_CART_ENABLE';
export const DISABLE = 'LIST_CART_DISABLE';

// Currently this is not stored on the server. But I should!

export const add = createAction(ADD);
export const remove = createAction(REMOVE);
export const swap = createAction(SWAP, (objA, objB) => ({
  from: objA,
  to: objB
}));
export const clear = createAction(CLEAR);

export const enable = createAction(ENABLE);
export const disable = createAction(DISABLE);
