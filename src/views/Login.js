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
    this.setState({error: false});
    this.props.login({username, password}).then(result => {
      this.setState({username: '', password: ''});
      this.setState({error: result.error});
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
  render() {
    let { logged, load: { loading } } = this.props.session;
    if (logged) {
      return (
        <Dialog id='dialog-login' title='Sign in' loading={loading}>
          Already signed in as USERNAME
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
                Invalid username or password
              </Alert>
            ) : null
          }
          <input type='text' placeholder='Username'
            value={this.state.username}
            onChange={this.handleChange.bind(this, 'username')} />
          <input type='password' placeholder='Password'
            value={this.state.password}
            onChange={this.handleChange.bind(this, 'password')} />
          <div className='footer'>
            <button>Sign in</button>
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
