import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { login, logout } from '../actions/session.js';
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
          this.setState({error: 'Invalid username or password'});
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
    window.location = '/api/user/auth/' + provider;
    e.preventDefault();
  }
  render() {
    let { username, id, load: { loading } } = this.props.session;
    if (id != null) {
      return (
        <Dialog id='dialog-login' title='Sign in' loading={loading}>
          Already signed in as { username }
          <div className='footer'>
            <button onClick={this.handleLogout.bind(this)}>Sign out</button>
          </div>
        </Dialog>
      );
    }
    return (
      <Dialog id='dialog-login' title='Sign in' loading={loading}>
        <form onSubmit={this.handleLogin.bind(this)}>
          {
            this.state.error ? (
              <Alert>
                {this.state.error}
              </Alert>
            ) : null
          }
          <input type='text' placeholder='Username' ref='username'
            value={this.state.username}
            onChange={this.handleChange.bind(this, 'username')} />
          <input type='password' placeholder='Password' ref='password'
            value={this.state.password}
            onChange={this.handleChange.bind(this, 'password')} />
          <div className='footer'>
            <button>Sign in</button>
            <button onClick={this.handleOAuth.bind(this, 'github')}>
              <i className="fa fa-github"></i> Sign in using GitHub
            </button>
          </div>
        </form>
      </Dialog>
    );
  }
}

Login.propTypes = {
  session: PropTypes.object,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

export default connect(
  store => ({session: store.session}),
  { login, logout }
)(Login);
