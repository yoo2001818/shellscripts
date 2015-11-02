import './style/ProgressBar.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentage: 100
    };
  }
  animate() {
    const { completed, total } = this.props.load;
    const { percentage } = this.state;
    this.setState({
      percentage:
        (percentage + Math.max(0, 80 - percentage) /
        10 / (total - completed) + 0.1)
    });
  }
  componentWillUnmount() {
    if (this.animInterval != null) {
      clearInterval(this.animInterval);
    }
  }
  componentWillReceiveProps(props) {
    if (props.load == null) return;
    const { loading, completed, total } = props.load;
    const percentage = loading ? (completed / total) * 100 : 100;
    this.setState({
      percentage: percentage
    });
    if (this.animInterval == null && percentage < 100) {
      this.animInterval = setInterval(this.animate.bind(this), 100);
    }
    if (this.animInterval != null && percentage === 100) {
      clearInterval(this.animInterval);
      this.animInterval = null;
    }
  }
  render() {
    const { loading } = this.props.load;
    const { percentage } = this.state;
    const loadingClass = classNames({
      enabled: loading,
      started: percentage === 0
    });
    const fillingStyle = {
      width: (percentage) + '%'
    };
    return (
      <div id='loadCover' className={loadingClass} >
        <div id='loader' className={loadingClass} >
          <div className='filling' style={fillingStyle} />
          <div className='percentage'>
            {percentage | 0 + '%'}
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
