import React, {Component, PropTypes} from 'react';
import serialize from 'serialize-javascript';
import DocumentMeta from 'react-document-meta';

export default class Html extends Component {
  render() {
    const {assets, component, store} = this.props;
    return (
      <html lang="ko">
        <head>
          <meta charSet="utf-8"/>
          {DocumentMeta.rewind({asReact: true})}

          <link rel="shortcut icon" href="/favicon.ico" />
          {Object.keys(assets.styles).map((style, i) =>
            <link href={assets.styles[style]} key={i} media="screen, projection"
                  rel="stylesheet" type="text/css"/>
          )}
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML=
            {{__html: React.renderToString(component)}}/>
          <script dangerouslySetInnerHTML=
            {{__html: `window.__data=${serialize(store)};`}} />
          <script src={assets.javascript.main}/>
        </body>
      </html>
    );
  }
}
Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.object,
  store: PropTypes.object
};
