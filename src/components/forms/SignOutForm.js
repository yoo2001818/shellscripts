import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Translated from '../Translated.js';
import { logout } from '../../actions/session.js';

class SignOutForm extends Component {
  handleLogout() {
    const { load: { loading }, id } = this.props.session;
    if (loading || id === false) return;
    this.props.logout();
  }
  render() {
    const { id } = this.props.session;
    if (id === false) return false;
    const { username } = this.props.user.entities[id];
    return (
      <div>
        <Translated name='alreadySignedIn'>{ username }</Translated>
        <div className='footer'>
          <button onClick={this.handleLogout.bind(this)}>
            <Translated name='signOut' />
          </button>
        </div>
      </div>
    );
  }
}

SignOutForm.propTypes = {
  session: PropTypes.object,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired
};

export default connect(
  store => ({
    session: store.session,
    user: store.user
  }),
  { logout }
)(SignOutForm);
