import './style/Overlay.scss';

import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Overlay extends Component {
  render() {
    return (
      <div className={classNames('overlay', this.props.className)}>
        <div className='container'>
          <div className='message'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};
