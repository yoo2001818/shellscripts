import './style/ErrorInput.scss';

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Alert from './Alert.js';
import Translated from './Translated.js';

export default class ErrorInput extends Component {
  render() {
    const className = classNames(this.props.className, {
      error: this.props.error && this.props.touched
    });
    return (
      <div className='errorInput'>
        <div className='input'>
          <label className='label'>
            <span className='placeholder'>
              {this.props.placeholder}
            </span>
            <input className={className} {...this.props}/>
          </label>
          <div className='indicator'>
            { this.props.error && this.props.touched ? (
              <i className="fa fa-times error"></i>
            ) : null }
            { !this.props.noSuccess & this.props.valid && this.props.touched &&
              !this.props.asyncValidating ? (
              <i className="fa fa-check valid"></i>
            ) : null }
            { this.props.asyncValidating ? (
              <i className="fa fa-refresh fa-spin"></i>
            ) : null }
          </div>
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
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.any,
  touched: PropTypes.bool,
  valid: PropTypes.bool,
  asyncValidating: PropTypes.bool,
  noSuccess: PropTypes.any
};
