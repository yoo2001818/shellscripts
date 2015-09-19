import './style/ErrorInput.scss';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Alert from './Alert.js';

export default class ErrorInput extends Component {
  render() {
    const className = classNames(this.props.className, {
      error: this.props.error && this.props.touched
    });
    return (
      <div className='errorInput'>
        <div className='input'>
          <input className={className} {...this.props}/>
          <div className='indicator'>
            { this.props.error && this.props.touched ? (
              <i className="fa fa-times error"></i>
            ) : null }
            { this.props.valid && this.props.touched ? (
              <i className="fa fa-check valid"></i>
            ) : null }
          </div>
        </div>
        { typeof this.props.error === 'string' && this.props.touched ? (
          <Alert>{ this.props.error }</Alert>
        ) : null }
      </div>
    );
  }
}

ErrorInput.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.any,
  touched: PropTypes.bool,
  valid: PropTypes.bool
};
