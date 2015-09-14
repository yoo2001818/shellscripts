import React, { Component, PropTypes } from 'react';
import translate from '../lang/index.js';
import { connect } from 'react-redux';

class Translated extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    let children = this.props.children;
    if (!Array.isArray(children)) children = [children];
    return (
      <span>
        {__(this.props.name, children)}
      </span>
    );
  }
}

Translated.propTypes = {
  lang: PropTypes.object,
  name: PropTypes.string.isRequired,
  children: PropTypes.any
};

export default connect(store => ({
  lang: store.lang
}))(Translated);
