import './style/LabelInput.scss';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class LabelInput extends Component {
  render() {
    return (
      <div className={classNames('labelInput input', this.props.className)}>
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
  className: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.any
};
