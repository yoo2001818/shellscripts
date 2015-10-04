import './style/SignUp.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Helmet from 'react-helmet';

import translate from '../lang/index.js';
import Dialog from '../components/Dialog.js';
import Translated from '../components/Translated.js';
import LocalSignUpForm from '../components/forms/LocalSignUpForm.js';
import PostSignUp from '../components/PostSignUp.js';
import LoadingOverlay from '../components/LoadingOverlay.js';
import SignOutForm from '../components/forms/SignOutForm.js';

import { oAuthSignUp, methodLoad } from '../actions/session.js';
import { reset } from 'redux-form';

class SignUp extends Component {
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    this.props.reset('localSignUp');
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
    if (id !== false) {
      const { signedUp } = this.props.user.entities[id];
      return (
        <div id='signup'>
          <Helmet title={__('signUp')} />
          { signedUp ? (
            <Dialog title={__('signUp')}>
              <SignOutForm />
            </Dialog>
          ) : (
            <div>
              <h1>
                <Translated name='signUp' />
              </h1>
              <PostSignUp />
            </div>
          ) }
          <LoadingOverlay loading={loading} />
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
        <Helmet title={__('signUp')} />
        <h1>
          <Translated name='signUp' />
        </h1>
        <p>
          <Translated name='signUpDesc' />
        </p>
        <div className='select'>
          <div className='section'>
            { hasLocal ? (
              <Dialog title={__('signUpEmail')}>
                <LocalSignUpForm />
              </Dialog>
            ) : false }
          </div>
          <div className='section others'>
            <h1>
              <Translated name='signUpOr' />
            </h1>
            { methodTags }
          </div>
        </div>
        <p className='footer'>
          <Translated name='signUpDisclaimer' />
        </p>
        <LoadingOverlay loading={loading} />
      </div>
    );
  }
}

SignUp.propTypes = {
  session: PropTypes.object,
  user: PropTypes.object,
  lang: PropTypes.object,
  oAuthSignUp: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};

const ConnectSignUp = connect(
  store => ({
    session: store.session,
    user: store.user,
    lang: store.lang
  }),
  { oAuthSignUp, reset }
)(SignUp);

ConnectSignUp.fetchData = function(store) {
  return store.dispatch(methodLoad());
};

export default ConnectSignUp;
