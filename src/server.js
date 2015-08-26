// Entry point for the server

import Express from 'express';
import path from 'path';
import React from 'react';

import Html from './views/Html.js';
import config from './config.js';

const app = new Express();

app.use(require('serve-static')(path.join(__dirname, '..', 'static')));

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  res.send('<!doctype html>\n' +
    React.renderToStaticMarkup(<Html assets={webpackIsomorphicTools.assets()}
      component={<div/>} store={null}/>));
});

if (config.port) {
  app.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info('==> Server is listening');
      console.info('==> %s running on port %s, API on port %s',
        config.app.name, config.port, config.apiPort);
      console.info('----------\n==> Open http://localhost:%s in a' +
        ' browser to view the app.', config.port);
    }
  });
} else {
  console.error('==> ERROR: No PORT environment variable has been specified');
}
