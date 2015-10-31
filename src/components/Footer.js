import './style/Footer.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import marked from 'marked';

import translate from '../lang/index.js';

class Footer extends Component {
  getContent() {
    const __ = translate(this.props.lang.lang);
    return {
      __html: marked(__('footer'), { sanitize: true })
    };
  }
  render() {
    return (
      <footer>
        <div className='container'>
          <span dangerouslySetInnerHTML={this.getContent()} />
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  lang: PropTypes.object
};

export default connect(
  (state) => ({lang: state.lang})
)(Footer);
