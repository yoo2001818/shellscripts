var WebpackIsomorphicTools = require('webpack-isomorphic-tools/plugin');
var path = require('path');

module.exports = {
  /*eslint-disable */
  webpack_assets_file_path: path.resolve(__dirname, 'webpack-assets.json'),
  /*eslint-enable */
  assets: {
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
      naming: function(m) {
        if (m.name == null) return undefined;
        // ./src/~~~
        if (m.name.indexOf('./src/') === 0) return '.' + m.name.slice(5);
        // How about node_modules? replace ~ to node_modules and we're good to
        // go.. But we shouldn't include '!'
        if (m.name.indexOf('./~/') === 0 && m.name.indexOf('!') === -1) {
          return '.' + m.name.replace('~', 'node_modules');
        }
      },
      parser: WebpackIsomorphicTools.url_loader_parser
    }, styles: {
      extensions: ['scss', 'sass', 'css'],
      filter: function(m, regexp) {
        var check = regexp.test(m.name);
        if (m.name.indexOf('./src/') === 0) return check;
        if (m.name.indexOf('./~/') === 0 && m.name.indexOf('!') === -1) {
          return check;
        }
        return false;
      },
      naming: function(m) {
        if (m.name == null) return undefined;
        // ./src/~~~
        if (m.name.indexOf('./src/') === 0) return '.' + m.name.slice(5);
        // How about node_modules? replace ~ to node_modules and we're good to
        // go.. But we shouldn't include '!'
        if (m.name.indexOf('./~/') === 0 && m.name.indexOf('!') === -1) {
          return '.' + m.name.replace('~', 'node_modules');
        }
      },
      parser: function(m, options) {
        if (m.source) {
          var regex = options.development ? /exports\.locals = ((.|\n)+);/ :
            /module\.exports = ((.|\n)+);/;
          var match = m.source.match(regex);
          return match ? JSON.parse(match[1]) : {};
        }
      }
    }
  }
};
