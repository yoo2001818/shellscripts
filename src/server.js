// Server init point
import express from 'express';
import ServeStatic from 'serve-static';
import compression from 'compression';

import serverRenderer from './utils/serverRenderer.js';

let app = express();

if (!__DEVELOPMENT__) {
  // Currently server does nothing but serve static files.
  app.use(compression());
  app.use('/assets', new ServeStatic('./dist'));
} else {
  // Webpack dev server :P
  // Importing in here because this is only used in webpack,
  // And we don't want to waste resources in production mode
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  let compiler = webpack(webpackConfig);

  app.use(webpackHotMiddleware(compiler, {
     log: console.log, heartbeat: 10 * 1000
  }));
  app.use(compression());
  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/assets/'
  }));
}

// TODO API endpoints

// Server side rendering
app.use(serverRenderer);

app.listen(8000, () => {
  console.log('server started');
});
