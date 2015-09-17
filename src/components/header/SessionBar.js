import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Translated from '../Translated.js';
import { logout } from '../../actions/session.js';

class SessionBar extends Component {
  handleLogout(e) {
    e.preventDefault();
    const { session } = this.props;
    if (session.load.loading) return;
    this.props.logout();
    return;
  }
  render() {
    const { session } = this.props;
    if (session.load.loading) {
      return (
        <div className='session loading'>
          <i className="fa fa-refresh fa-spin"></i>
        </div>
      );
    }
    if (session.id != null) {
      return (
        <div className='session'>
          { session.signedIn ? (
            <Translated name='sessionWelcome'>
              { session.username }
            </Translated>
          ) : false }
          <Link to='/logout' onClick={this.handleLogout.bind(this)}>
            <Translated name='signOut' />
          </Link>
        </div>
      );
    } else {
      return (
        <div className='session'>
          <Link to='/login'>
            <Translated name='signIn' />
          </Link>
          <Link to='/signup'>
            <Translated name='signUp' />
          </Link>
          {
            session.error ? (
              <span><i className="fa fa-exclamation-triangle"></i></span>
            ) : null
          }
        </div>
      );
    }
  }
}

SessionBar.propTypes = {
  session: PropTypes.object,
  logout: PropTypes.func.isRequired
};

export default connect(
  state => ({session: state.session}),
  { logout }
)(SessionBar);
