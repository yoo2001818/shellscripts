import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';

import configureStore from '../store/index.js';
import routes from '../views/routes.js';

import prefetch from '../utils/prefetch.js';
import { dummyClient } from '../api/client.js';

function renderPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Shellscripts</title>
      </head>
      <body>
        <div id='wrapper'>${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/assets/bundle.js"></script>
      </body>
    </html>
    `;
}

export default function serverRenderer(req, res) {
  const store = configureStore(undefined, dummyClient);
  Router.run(routes, req.url, (Handler, routerState) => {
    prefetch(store, routerState)
    .then(() => {
      let appHtml = React.renderToString(
        <div id='root'>
          <Provider store={store}>
            {() => <Handler routerState={routerState} />}
          </Provider>
        </div>
      );
      let page = renderPage(appHtml, store.getState());
      res.send(page);
    });
  });
}
