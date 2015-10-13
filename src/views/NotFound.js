import './style/NotFound.scss';
import notFoundImage from '../assets/notFound.png';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Translated from '../components/ui/Translated.js';
import translate from '../lang/index.js';

class NotFound extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    return (
      <div id="error-404">
        <Helmet title={__('pageNotFound')} />
        <h1>
          <Translated name='pageNotFound' />
        </h1>
        <img src={notFoundImage} />
        <p>
          <Translated name='pageNotFoundDesc' />
        </p>
      </div>
    );
  }
}

NotFound.propTypes = {
  lang: PropTypes.object
};

export default connect(
  store => ({lang: store.lang})
)(NotFound);
