import './style/Dialog.scss';

import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Dialog extends Component {
  render() {
    const dialogClass = classNames('dialog', {
      loading: this.props.loading
    });
    return (
      <div className={dialogClass} {...this.props}>
        <h1 className='title'>{this.props.title}</h1>
        <div className='content'>
          {this.props.children}
        </div>
        {
          this.props.loading ? (
            <div className='loading'>
              <div className='container'>
                <div className='message'>
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
  loading: PropTypes.bool
};
