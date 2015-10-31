// Set up global variables
var PRODUCTION = process.env.NODE_ENV === 'production';
GLOBAL.__SERVER__ = true;
GLOBAL.__CLIENT__ = false;
GLOBAL.__DEVELOPMENT__ = !PRODUCTION;
GLOBAL.__DEVTOOLS__ = false;

var path = require('path');
var projectPath = path.resolve(__dirname, __DEVELOPMENT__ ? 'src' : 'lib');
var netConfig = require('./config/network.config.js');

if (__DEVELOPMENT__) {
  // Support ES6
  require('babel/register');
}

if (process.env.SERVER_RUN_AS_API === 'yes') {
  // Simply run as API server
  require(path.resolve(projectPath, 'api.js'));
} else {
  // Start API server
  if (__DEVELOPMENT__ || !netConfig.apiFork ||
    process.env.SERVER_NO_FORK === 'yes'
  ) {
    // If in development state, it's much better to just require it
    // since babel translation is a memory-hog
    require(path.resolve(projectPath, 'api.js'));
  } else {
    require('child_process').fork('./index.js', [], {
      env: {
        SERVER_RUN_AS_API: 'yes'
      }
    });
  }
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
  global.__WEBPACK_ISOMORPHIC_TOOLS__ = new WebpackIsomorphicTools(
    require('./webpack-isomorphic-tools.config.js')
  )
  .development(__DEVELOPMENT__)
  .server(projectPath, function() {
    require(path.resolve(projectPath, 'server.js'));
  });
}
