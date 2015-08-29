import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class SessionBar extends Component {
  render() {
    const { session } = this.props;
    if (!session.loaded) {
      return (
        <div className='session loading'>
          <i className="fa fa-refresh fa-spin"></i>
        </div>
      );
    }
    if (session.logged) {
      return (
        <div className='session'>
          Welcome!
        </div>
      );
    } else {
      return (
        <div className='session'>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Register</Link>
        </div>
      );
    }
  }
}

SessionBar.propTypes = {
  session: PropTypes.object
};

export default connect(
  state => ({session: state.session})
)(SessionBar);
