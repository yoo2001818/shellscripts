import './style/SignUp.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Accordion from '../components/Accordion.js';

import { signUp } from '../actions/session.js';

class SignUp extends Component {
  constructor(props) {
    super(props);
  }
  handleOAuth(provider, e) {
    // This requires actual page forwarding...
    window.location = '/api/user/auth/' + provider;
    e.preventDefault();
  }
  render() {
    let { username, id, load: { loading } } = this.props.session;
    if (id != null) {
      return (
        <div id='signup'>
          <h1>Create an account</h1>
          <p>Already signed in.</p>
        </div>
      );
    }
    return (
      <div id='signup'>
        <h1>Create an account</h1>
        <p>
          You can create an account using GitHub, or alternatively, you can
          create an account by writing your username and password below.
        </p>
        <div className='signupSelect'>
          <button>Create an account using GitHub</button>
          <Accordion title='Create an account using E-mail address'>
            <input placeholder='Username' />
            <input placeholder='E-mail address' type='email' />
            <input placeholder='Password' type='password' />
            <div className='footer'>
              <button>Create an account</button>
            </div>
          </Accordion>
        </div>
        <p className='footer'>
          By creating an account, blah blah blah blah blah.
        </p>
      </div>
    );
  }
}

SignUp.propTypes = {
  session: PropTypes.object
};

export default connect(
  store => ({session: store.session}),
  { signUp }
)(SignUp);
