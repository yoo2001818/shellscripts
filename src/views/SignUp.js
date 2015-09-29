import './style/SignUp.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import translate from '../lang/index.js';
import Dialog from '../components/Dialog.js';
import Translated from '../components/Translated.js';
import LocalSignUpForm from '../components/LocalSignUpForm.js';
import PostSignUp from '../components/PostSignUp.js';

import { oAuthSignUp, methodLoad } from '../actions/session.js';

class SignUp extends Component {
  constructor(props) {
    super(props);
  }
  handleOAuth(provider, e) {
    // This requires actual page forwarding...
    window.location = '/api/session/' + provider;
    this.props.oAuthSignUp();
    e.preventDefault();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    let { id, method, load: { loading } } = this.props.session;
    if (id != null) {
      return (
        <div id='signup'>
          <h1>
            <Translated name='signUp' />
          </h1>
          <PostSignUp />
        </div>
      );
    }
    let methodTags, hasLocal = false;
    if (method == null) {
      methodTags = false;
      hasLocal = false;
    } else {
      methodTags = _.values(method).map(provider => {
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
        { loading ? (
          <div className='loading'>
            <i className="fa fa-refresh fa-spin"></i>
          </div>
        ) : (
          <div className='signupSelect'>
            { hasLocal ? (
              <Dialog title={__('signUpEmail')} className='small'>
                <LocalSignUpForm />
              </Dialog>
            ) : false }
            { methodTags }
          </div>
        )}
        <p className='footer'>
          <Translated name='signUpDisclaimer' />
        </p>
      </div>
    );
  }
}

SignUp.propTypes = {
  session: PropTypes.object,
  lang: PropTypes.object,
  oAuthSignUp: PropTypes.func
};

const ConnectSignUp = connect(
  store => ({session: store.session, lang: store.lang}),
  { oAuthSignUp }
)(SignUp);

ConnectSignUp.fetchData = function(store) {
  return store.dispatch(methodLoad());
};

export default ConnectSignUp;
