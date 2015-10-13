import './style/ProgressBar.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class ProgressBar extends Component {
  render() {
    const { loading, completed, total } = this.props.load;
    const percentage = loading ? (completed / total) * 100 | 0 : 100;
    const loadingClass = classNames({
      enabled: loading,
      started: percentage === 0
    });
    const fillingStyle = {
      width: percentage + '%'
    };
    return (
      <div id='loadCover' className={loadingClass} >
        <div id='loader' className={loadingClass} >
          <div className='filling' style={fillingStyle} />
          <div className='percentage'>
            {percentage + '%'}
          </div>
        </div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  load: PropTypes.object.isRequired
};

export default connect(
  (state) => ({load: state.load})
)(ProgressBar);
