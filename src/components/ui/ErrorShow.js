import React, { Component, PropTypes } from 'react';

import Alert from './Alert.js';
import Translated from './Translated.js';

export default class ErrorInput extends Component {
  render() {
    return (
      <div className='errorInput'>
        <div className='input'>
          <label className='label'>
            <span className='field'>
              {this.props.children}
            </span>
          </label>
        </div>
        { typeof this.props.error === 'string' && this.props.touched ? (
          <Alert>{ this.props.error }</Alert>
        ) : null }
        { this.props.error && this.props.error.id && this.props.touched ? (
          <Alert>
            <Translated name={this.props.error.id}/>
          </Alert>
        ) : null }
      </div>
    );
  }
}

ErrorInput.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.any,
  touched: PropTypes.bool,
  valid: PropTypes.bool,
  asyncValidating: PropTypes.bool,
  noSuccess: PropTypes.any,
  children: PropTypes.any
};
