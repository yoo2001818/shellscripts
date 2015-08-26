import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../actions/user.js';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p>
          {this.props.loggedIn ? 'Hello!' : 'Please log in.'}
        </p>
        {this.props.loggedIn ?
          <button onClick={this.props.logout.bind(this, null)}>Logout</button>
        :
          <button onClick={this.props.login.bind(this, null)}>Login</button>
        }
      </div>
    );
  }
}

App.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    loggedIn: state.user.loggedIn
  };
}

export default connect(
  mapStateToProps,
  { login, logout }
)(App);
