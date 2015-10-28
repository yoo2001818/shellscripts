// Support ES6
require('babel/register');

// Set up global variables
var PRODUCTION = process.env.NODE_ENV === 'production';
GLOBAL.__SERVER__ = true;
GLOBAL.__CLIENT__ = false;
GLOBAL.__DEVELOPMENT__ = !PRODUCTION;
GLOBAL.__DEVTOOLS__ = false;

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var path = require('path');
var projectPath = path.resolve(__dirname, __DEVELOPMENT__ ? 'src' : 'lib');

global.__WEBPACK_ISOMORPHIC_TOOLS__ = new WebpackIsomorphicTools(
  require('./webpack-isomorphic-tools.config.js')
)
.development(__DEVELOPMENT__)
.server(projectPath, function() {
  require(path.resolve(projectPath, 'server.js'));
});
