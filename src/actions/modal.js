import { createAction } from 'redux-actions';

export const OPEN = 'MODAL_OPEN';
export const CLOSE = 'MODAL_CLOSE';

export const open = createAction(OPEN,
  data => data
);

export const close = createAction(CLOSE);

export function answer(choice) {
  return (dispatch, getState) => {
    const { modal } = getState();
    if (modal.choices[choice].action) {
      dispatch(modal.choices[choice].action);
    }
    dispatch(close());
  };
}
