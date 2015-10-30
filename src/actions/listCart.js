import { createAction } from 'redux-actions';
import { open } from './modal.js';

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

export function confirmDisable() {
  return (dispatch, getState) => {
    if (getState().listCart.list.length === 0) return dispatch(disable());
    dispatch(open({
      title: 'confirmListCartDisable',
      body: {
        translated: 'confirmListCartDisableDescription'
      },
      choices: [
        {
          name: 'yes',
          type: 'red-button',
          action: disable()
        },
        {
          name: 'no'
        }
      ]
    }));
  };
}
