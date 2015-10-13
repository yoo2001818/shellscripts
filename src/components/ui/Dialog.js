import './style/Dialog.scss';

import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import LoadingOverlay from './LoadingOverlay.js';

export default class Dialog extends Component {
  render() {
    const dialogClass = classNames('dialog', {
      loading: this.props.loading
    }, this.props.className);
    const contentClass = classNames('content', {
      hidden: this.props.hidden
    });
    let titleBar = this.props.titleObj;
    if (titleBar == null) {
      titleBar = (
        <h1 className='title'>{this.props.title}</h1>
      );
    }
    return (
      <div className={dialogClass}>
        {titleBar}
        <div className={contentClass}>
          {this.props.children}
        </div>
        <LoadingOverlay loading={this.props.loading} />
      </div>
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
  titleObj: PropTypes.any,
  loading: PropTypes.bool,
  hidden: PropTypes.bool,
  className: PropTypes.any
};
