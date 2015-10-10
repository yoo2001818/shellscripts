import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SignedUpRedirector extends Component {
  componentWillMount() {
    const user = this.props.user;
    const { history } = this.context;
    // Redirect if user hasn't signed in.
    if (user != null && !user.signedUp && !history.isActive('/signup')) {
      history.replaceState(null, '/signup');
    }
  }
  componentDidUpdate() {
    const user = this.props.user;
    const { history } = this.context;
    // Redirect if user hasn't signed in.
    if (user != null && !user.signedUp && !history.isActive('/signup')) {
      history.replaceState(null, '/signup');
    }
  }
  render() {
    return false;
  }
}

SignedUpRedirector.propTypes = {
  user: PropTypes.object
};

SignedUpRedirector.contextTypes = {
  history: PropTypes.any
};

export default connect(
  store => {
    const { entities: { users }, session } = store;
    return {
      user: users[session.login]
    };
  }
)(SignedUpRedirector);
