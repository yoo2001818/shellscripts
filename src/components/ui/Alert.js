import './style/Alert.scss';

import React, { Component, PropTypes } from 'react';

export default class Alert extends Component {
  render() {
    return (
      <div className='alert'>
        {this.props.children}
      </div>
    );
  }
}

Alert.propTypes = {
  children: PropTypes.any
};
