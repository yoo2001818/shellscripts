import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Translated from '../Translated.js';
import { logout } from '../../actions/session.js';

class SignOutForm extends Component {
  handleLogout() {
    let { load: { loading }, id } = this.props.session;
    if (loading || id == null) return;
    this.props.logout();
  }
  render() {
    let { username } = this.props.session;
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
  logout: PropTypes.func.isRequired
};

export default connect(
  store => ({session: store.session}),
  { logout }
)(SignOutForm);
