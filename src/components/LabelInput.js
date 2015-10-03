import './style/LabelInput.scss';

import React, { Component, PropTypes } from 'react';

export default class LabelInput extends Component {
  render() {
    return (
      <div className='labelInput'>
        <label>
          <span className='label'>
            {this.props.label}
          </span>
          <span className='field'>
            {this.props.children}
          </span>
        </label>
      </div>
    );
  }
}

LabelInput.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any
};
