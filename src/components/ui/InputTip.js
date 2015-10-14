import './style/InputTip.scss';

import React, { Component, PropTypes } from 'react';

export default class InputTip extends Component {
  render() {
    return (
      <div className='input-tip'>
        {this.props.children}
      </div>
    );
  }
}

InputTip.propTypes = {
  children: PropTypes.any
};
