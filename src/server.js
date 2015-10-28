// Server init point
import express from 'express';
import ServeStatic from 'serve-static';
import compression from 'compression';
import morgan from 'morgan';

import serverRenderer from './utils/serverRenderer.js';
import apiProxy from './utils/apiProxy.js';
import netConfig from '../config/network.config.js';

let app = express();

app.use(morgan('dev'));

if (netConfig.useReverseProxy) {
  app.use('/api', apiProxy);
}

app.use('/uploads', new ServeStatic('./uploads'));
app.get('/favicon.ico', (req, res) => {
  res.sendStatus(404);
});

if (!__DEVELOPMENT__) {
  // Currently server does nothing but serve static files.
  app.use(compression());
  app.use('/assets/', new ServeStatic('./dist'));
} else {
  app.get('/assets/bundle.css', (req, res) => {
    res.sendStatus(404);
  });
  // Webpack dev server :P
  // Importing in here because this is only used in webpack,
  // And we don't want to waste resources in production mode
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  let compiler = webpack(webpackConfig);

  app.use(webpackHotMiddleware(compiler, {
    log: null, heartbeat: 10 * 1000
  }));
  app.use(compression());
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: '/assets/'
  }));
}

// TODO API endpoints

// Server side rendering
app.use(serverRenderer);

app.listen(netConfig.port, () => {
  console.log('server started');
});
