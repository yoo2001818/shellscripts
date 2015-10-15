import * as ModalActions from '../actions/modal.js';

export default function modal(state = {
  open: false
}, action) {
  const { type, payload } = action;
  switch (type) {
  case ModalActions.OPEN:
    return Object.assign({}, state, payload, {
      open: true
    });
  case ModalActions.CLOSE:
    return Object.assign({}, state, {
      open: false
    });
  }
  return state;
}
