import './style/Overlay.scss';

import React, { Component, PropTypes } from 'react';
import Overlay from './Overlay.js';

export default class LoadingOverlay extends Component {
  render() {
    if (this.props.loading) {
      return (
        <Overlay className='loading'>
          <i className="fa fa-refresh fa-spin"></i>
        </Overlay>
      );
    }
    return false;
  }
}

LoadingOverlay.propTypes = {
  loading: PropTypes.bool
};
