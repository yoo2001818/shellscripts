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
  let devTools = null;
  if (__CLIENT__ && __DEVELOPMENT__) {
    const { DevTools, DebugPanel, LogMonitor }
      = require('redux-devtools/lib/react');
    devTools = (
      <DebugPanel top right bottom key="debugPanel">
        <DevTools store={store} monitor={LogMonitor}/>
      </DebugPanel>
    );
  }
  React.render(
    <div id='root'>
      <Provider store={store}>
        {() => <Handler routerState={routerState} />}
      </Provider>
      {devTools}
    </div>,
    document.body
  );
});
