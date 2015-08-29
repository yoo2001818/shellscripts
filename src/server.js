// Server init point
const PRODUCTION = process.env.NODE_ENV === 'production';
GLOBAL._SERVER_ = true;
GLOBAL._CLIENT_ = false;
GLOBAL._DEVELOPMENT_ = !PRODUCTION;

import express from 'express';
import ServeStatic from 'serve-static';

let app = express();

if (PRODUCTION) {
  // Currently server does nothing but serve static files.
  app.use(new ServeStatic('./dist'));
} else {
  // Webpack dev server :P
  // Importing in here because this is only used in webpack,
  // And we don't want to waste resources in production mode
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  let compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));
}

app.listen(8000, () => {
  console.log('server started');
});
