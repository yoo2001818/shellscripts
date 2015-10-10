import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SignInRedirector extends Component {
  componentWillMount() {
    let { login } = this.props.session;
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (login == null) {
      history.replaceState(null, '/login');
    }
  }
  componentDidUpdate() {
    let { login } = this.props.session;
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (login == null) {
      history.replaceState(null, '/login');
    }
  }
  render() {
    return false;
  }
}

SignInRedirector.propTypes = {
  session: PropTypes.object
};

SignInRedirector.contextTypes = {
  history: PropTypes.any
};

export default connect(
  store => ({session: store.session})
)(SignInRedirector);
