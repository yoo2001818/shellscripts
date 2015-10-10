// Client init point
import 'babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';

import configureStore from './store/index.js';
import routes from './views/routes.js';

import prefetch from './utils/prefetch.js';
import { superagentClient } from './utils/apiClient.js';

let initialState;
if (typeof window !== 'undefined') initialState = window.__INITIAL_STATE__;

let history = createHistory();

const store = configureStore(initialState, superagentClient());

// TODO language set part
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

/*Router.run(routes, HistoryLocation, (Handler, routerState) => {
  prefetch(store, routerState);
  let devTools = null;
  if (__CLIENT__ && __DEVELOPMENT__ && __DEVTOOLS__) {
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
    document.getElementById('wrapper')
  );
});*/
