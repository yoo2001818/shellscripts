// Kinda weird :/
import './style/SignUp.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Helmet from 'react-helmet';

import translate from '../lang/index.js';
import Translated from '../components/ui/Translated.js';
import { oAuthSignUp, login, logout, methodLoad } from '../actions/session.js';
import { reset } from 'redux-form';
import Dialog from '../components/ui/Dialog.js';
import LocalLoginForm from '../components/forms/LocalLoginForm.js';
import SignOutForm from '../components/forms/SignOutForm.js';
import LoadingOverlay from '../components/ui/LoadingOverlay.js';

class Login extends Component {
  componentWillUnmount() {
    this.props.reset('localLogin');
  }
  handleLogout() {
    let { load: { loading } } = this.props.session;
    if (loading) return;
    this.props.logout();
  }
  handleOAuth(provider, e) {
    // This requires actual page forwarding...
    window.location = '/api/session/' + provider;
    // oAuth only has one method..
    this.props.oAuthSignUp();
    e.preventDefault();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    let { login, load: { loading }, method } = this.props.session;
    if (login != null) {
      return (
        <div id='login'>
          <Helmet title={__('signIn')} />
          {/*<h1>
            <Translated name='signIn'/>
          </h1>*/}
          <Dialog title={__('signIn')}>
            <SignOutForm />
          </Dialog>
          <LoadingOverlay loading={loading} />
        </div>
      );
    }
    let methodTags, hasLocal = false;
    if (method == null) {
      methodTags = false;
      hasLocal = true;
    } else {
      methodTags = _.values(method).map(provider => {
        if (provider.identifier === 'local') {
          hasLocal = true;
          return false;
        }
        return (
          <button onClick={this.handleOAuth.bind(this, provider.identifier)}
            key={provider.identifier}>
            <Translated name='signInUsing'>
              { provider.name }
            </Translated>
          </button>
        );
      });
    }
    return (
      <div id='login'>
        <Helmet title={__('signIn')} />
        <h1>
          <Translated name='signIn'/>
        </h1>
        <div className='select'>
          <div className='section'>
            { hasLocal ? (
              <Dialog title={__('signIn')}>
                <LocalLoginForm />
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
        <LoadingOverlay loading={loading} />
      </div>
    );
  }
}

Login.propTypes = {
  session: PropTypes.object,
  lang: PropTypes.object,
  oAuthSignUp: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};

const ConnectLogin = connect(
  store => ({session: store.session, lang: store.lang}),
  { login, logout, oAuthSignUp, reset }
)(Login);

ConnectLogin.fetchData = function(store) {
  return store.dispatch(methodLoad());
};

export default ConnectLogin;
