import React, { Component, PropTypes } from 'react';
import translate from '../lang/index.js';
import { connect } from 'react-redux';

class Index extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    return (
      <div>
        <h1>{__('hello', 'World')}</h1>
      </div>
    );
  }
}

Index.propTypes = {
  lang: PropTypes.object
};

export default connect(store => ({
  lang: store.lang
}))(Index);
