import './style/LoadingOverlay.scss';

import React, { Component, PropTypes } from 'react';

export default class Overlay extends Component {
  render() {
    return (
      <div className='loadingOverlay'>
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
  children: PropTypes.any
};
