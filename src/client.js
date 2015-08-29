// Client init point
import 'babel/polyfill';
import React from 'react';
// Why we are using hash? Because BrowserHistory requires a server.
import { history } from 'react-router/lib/HashHistory';

import configureStore from './store/index.js';
import Root from './views/Root.js';

const store = configureStore();

React.render(
  <Root history={history} store={store}/>,
  document.body
);
