import * as ToastActions from '../actions/toast.js';

export default function toast(state = {
  open: false
}, action) {
  const { type, payload } = action;
  switch (type) {
  case ToastActions.OPEN:
    return Object.assign({}, state, payload, {
      open: true,
      date: new Date().valueOf()
    });
  case ToastActions.CLOSE:
    return Object.assign({}, state, {
      open: false
    });
  }
  return state;
}
