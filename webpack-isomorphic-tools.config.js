var WebpackIsomorphicTools = require('webpack-isomorphic-tools/plugin');

module.exports = {
  assets: {
    images: {
      extensions: ['png', 'jpg', 'gif', 'ico', 'svg'],
      parser: WebpackIsomorphicTools.url_loader_parser
    }, styles: {
      extensions: ['scss', 'sass', 'css'],
      naming: function(m) {
        if (m.name == null) return undefined;
        // ./src/~~~
        if (m.name.indexOf('./src/') === 0) return m.name;
        // How about node_modules? replace ~ to node_modules and we're good to
        // go.. But we shouldn't include '!'
        if (m.name.indexOf('./~/') === 0 && m.name.indexOf('!') === -1) {
          return m.name.replace('~', 'node_modules');
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
