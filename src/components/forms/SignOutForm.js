import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Translated from '../ui/Translated.js';
import { logout } from '../../actions/session.js';

class SignOutForm extends Component {
  handleLogout() {
    const { load: { loading }, id } = this.props.session;
    if (loading || id === false) return;
    this.props.logout();
  }
  render() {
    const { user } = this.props;
    if (user == null) return false;
    const { username } = user;
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
  store => {
    const { session, entities: { users }} = store;
    const user = users[session.login];
    return { session, user };
  },
  { logout }
)(SignOutForm);
