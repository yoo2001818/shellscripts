import * as LangActions from '../actions/lang.js';

export default function lang(state = {
  lang: 'en'
}, action) {
  switch (action.type) {
  case LangActions.SET:
    return Object.assign({}, state, {
      lang: action.payload
    });
  }
  return state;
}
