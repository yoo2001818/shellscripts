import moment from 'moment';

import * as LangActions from '../actions/lang.js';

export default function lang(state = {
  lang: 'en'
}, action) {
  switch (action.type) {
  case LangActions.SET:
    let lang = action.payload || 'en';
    if (lang.body) lang = lang.body;
    if (__CLIENT__) {
      moment.locale(lang);
    }
    return Object.assign({}, state, {
      lang
    });
  }
  return state;
}
