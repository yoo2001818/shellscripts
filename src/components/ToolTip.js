import './style/ToolTip.scss';

import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class ToolTip extends Component {
  render() {
    return (
      <span className={classNames('tooltip', this.props.className)}>
        <span className='content'>
          {this.props.children}
        </span>
        <div className='caption'>
          {this.props.caption}
        </div>
      </span>
    );
  }
}

ToolTip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  caption: PropTypes.string
};
