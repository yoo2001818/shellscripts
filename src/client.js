// Client init point
import 'babel/polyfill';
import React from 'react';
// Why we are using hash? Because HistoryLocation requires a server.
import Router, { HashLocation } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/index.js';
import routes from './views/routes.js';

const store = configureStore();

Router.run(routes, HashLocation, (Handler, routerState) => {
  React.render(
    <Provider store={store}>
      {() => <Handler routerState={routerState} />}
    </Provider>,
    document.body
  );
});
