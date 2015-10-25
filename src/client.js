// Client init point
import 'babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import moment from 'moment';

import configureStore from './store/index.js';
import routes from './views/routes.js';

import prefetch from './utils/prefetch.js';
import { superagentClient } from './utils/apiClient.js';

import developerText from 'raw!./assets/developer.txt';

if (console.info) {
  console.info(developerText);
} else {
  console.log(developerText);
}

let initialState;
if (typeof window !== 'undefined') initialState = window.__INITIAL_STATE__;

let history = createHistory();

const store = configureStore(initialState, superagentClient());

// TODO language set part

moment.locale(store.getState().lang.lang);

// TODO devTools

function handleUpdate() {
  prefetch(store, this.state);
}

render(
  <div id='root'>
    <Provider store={store}>
      <Router routes={routes} history={history} onUpdate={handleUpdate} />
    </Provider>
  </div>,
  document.getElementById('wrapper')
);

if (__CLIENT__ && __DEVELOPMENT__ && __DEVTOOLS__) {
  // Use require because imports can't be conditional.
  // In production, you should ensure process.env.NODE_ENV
  // is envified so that Uglify can eliminate this
  // module and its dependencies as dead code.
  require('./utils/createDevToolsWindow.js')(store);
}
