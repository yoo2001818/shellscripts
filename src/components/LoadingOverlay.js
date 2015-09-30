import './style/LoadingOverlay.scss';

import React, { Component, PropTypes } from 'react';

export default class LoadingOverlay extends Component {
  render() {
    if (this.props.loading) {
      return (
        <div className='loadingOverlay'>
          <div className='container'>
            <div className='message'>
              <i className="fa fa-refresh fa-spin"></i>
            </div>
          </div>
        </div>
      );
    }
    return false;
  }
}

LoadingOverlay.propTypes = {
  loading: PropTypes.bool
};
