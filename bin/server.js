#!/usr/bin/env node
require('babel/register');
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

if (!__DEVELOPMENT__ || require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
  // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(
    require('../webpack/webpack-isomorphic-tools.js'))
    .development(__DEVELOPMENT__)
    .server(rootDir, function()
    {
      require('../src/server.js');
    });
}
