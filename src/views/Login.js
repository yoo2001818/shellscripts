import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import translate from '../lang/index.js';
import Translated from '../components/Translated.js';
import { oAuthSignUp, login, logout, methodLoad } from '../actions/session.js';
import Dialog from '../components/Dialog.js';
import Alert from '../components/Alert.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: '',
      password: ''
    };
  }
  handleChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }
  handleLogin(e) {
    e.preventDefault();
    let { load: { loading } } = this.props.session;
    if (loading) return;
    const { username, password } = this.state;
    if (username === '') {
      this.refs.username.getDOMNode().focus();
      return;
    }
    if (password === '') {
      this.refs.password.getDOMNode().focus();
      return;
    }
    this.setState({error: false});
    this.props.login({username, password}, {
      errors: [401]
    }).then(result => {
      this.setState({username: '', password: ''});
      if (result.error) {
        if (result.payload.status === 401) {
          this.setState({error: result.payload.body.message});
          this.refs.username.getDOMNode().focus();
        } else {
          this.setState({error: result.payload.body});
        }
      }
    });
  }
  handleLogout() {
    let { load: { loading } } = this.props.session;
    if (loading) return;
    this.props.logout().then(result => {
      console.log(result);
      this.setState({username: '', password: ''});
    });
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
    let { username, id, load: { loading }, method } = this.props.session;
    if (id != null) {
      return (
        <Dialog id='dialog-login' title={__('signIn')} loading={loading}>
          <Translated name='alreadySignedIn'>{ username }</Translated>
          <div className='footer'>
            <button onClick={this.handleLogout.bind(this)}>
              <Translated name='signOut' />
            </button>
          </div>
        </Dialog>
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
      <Dialog id='dialog-login' title={__('signIn')} loading={loading}>
        <form onSubmit={this.handleLogin.bind(this)}>
          {
            this.state.error ? (
              <Alert>
                {this.state.error}
              </Alert>
            ) : null
          }
          {
            hasLocal ? (
              <div>
                <input type='text' placeholder={__('username')} ref='username'
                  value={this.state.username}
                  onChange={this.handleChange.bind(this, 'username')} />
                <input type='password' placeholder={__('password')}
                  ref='password' value={this.state.password}
                  onChange={this.handleChange.bind(this, 'password')} />
              </div>
            ) : null
          }
          <div className='footer'>
            {
              hasLocal ? (
                <button><Translated name='signIn' /></button>
              ) : null
            }
            { methodTags }
          </div>
        </form>
      </Dialog>
    );
  }
}

Login.propTypes = {
  session: PropTypes.object,
  lang: PropTypes.object,
  oAuthSignUp: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const ConnectLogin = connect(
  store => ({session: store.session, lang: store.lang}),
  { login, logout, oAuthSignUp }
)(Login);

ConnectLogin.fetchData = function(store) {
  return store.dispatch(methodLoad());
};

export default ConnectLogin;
