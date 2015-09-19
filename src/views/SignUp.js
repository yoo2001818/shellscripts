import './style/SignUp.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import translate from '../lang/index.js';
import Dialog from '../components/Dialog.js';
import Translated from '../components/Translated.js';
import LocalSignUpForm from '../components/LocalSignUpForm.js';

import { signUp, methodLoad } from '../actions/session.js';

class SignUp extends Component {
  constructor(props) {
    super(props);
  }
  handleOAuth(provider, e) {
    // This requires actual page forwarding...
    window.location = '/api/session/' + provider;
    e.preventDefault();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    let { id, method } = this.props.session;
    if (id != null) {
      return (
        <div id='signup'>
          <h1>Create an account</h1>
          <p>Already signed in.</p>
        </div>
      );
    }
    let methodTags, hasLocal = false;
    if (method == null) {
      methodTags = false;
      hasLocal = false;
    } else {
      methodTags = method.map(provider => {
        if (provider.identifier === 'local') {
          hasLocal = true;
          return false;
        }
        return (
          <button onClick={this.handleOAuth.bind(this, provider.identifier)}
            key={provider.identifier}>
            <Translated name='signUpUsing'>
              { provider.name }
            </Translated>
          </button>
        );
      });
    }
    return (
      <div id='signup'>
        <h1>
          <Translated name='signUp' />
        </h1>
        <p>
          <Translated name='signUpDesc' />
        </p>
        <div className='signupSelect'>
          { hasLocal ? (
            <Dialog title={__('signUpEmail')} className='small'>
              <LocalSignUpForm />
            </Dialog>
          ) : false }
          { methodTags }
        </div>
        <p className='footer'>
          <Translated name='signUpDisclaimer' />
        </p>
      </div>
    );
  }
}

SignUp.propTypes = {
  session: PropTypes.object,
  lang: PropTypes.object
};

const ConnectSignUp = connect(
  store => ({session: store.session, lang: store.lang}),
  { signUp }
)(SignUp);

ConnectSignUp.fetchData = function(store) {
  return store.dispatch(methodLoad());
};

export default ConnectSignUp;
