import React from 'react';
import createLocation from 'history/lib/createLocation';
import { RoutingContext, match } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from '../store/index.js';
import routes from '../views/routes.js';

import prefetch from '../utils/prefetch.js';
import { superagentClient } from '../api/client.js';

import * as LangActions from '../actions/lang.js';

function renderPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Shellscripts</title>
        <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="stylesheet" type="text/css" href="/assets/bundle.css">
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
  if (__SERVER__ && __DEVELOPMENT__) {
    __WEBPACK_ISOMORPHIC_TOOLS__.refresh();
  }
  const location = createLocation(req.originalUrl);
  const store = configureStore(undefined, superagentClient(req));
  // TODO should be moved to somewhere else...
  store.dispatch(LangActions.set(req.acceptsLanguages('ko', 'en') || 'en'));
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      res.status(500).send(error.message);
    } else if (renderProps == null) {
      res.sendStatus(404);
    } else {
      prefetch(store, renderProps)
      .then(() => {
        let appHtml = React.renderToString(
          <div id='root'>
            <Provider store={store}>
              {() => <RoutingContext {...renderProps} />}
            </Provider>
          </div>
        );
        let page = renderPage(appHtml, store.getState());
        res.send(page);
      })
      .catch(err => {
        res.status(500).send(err.stack);
      });
    }
  });
  /*Router.run(routes, req.originalUrl, (Handler, routerState) => {
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
    })
    .catch(e => {
      console.log(e.stack);
      // TODO this should be removed from the production server
      res.send(e.stack);
    });
  });*/
}
