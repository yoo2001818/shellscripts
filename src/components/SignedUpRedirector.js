import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SignedUpRedirector extends Component {
  componentWillMount() {
    let { id, signedUp } = this.props.session;
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (id != null && !signedUp && !history.isActive('/signup')) {
      history.replaceState(null, '/signup');
    }
  }
  componentDidUpdate() {
    let { id, signedUp } = this.props.session;
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (id != null && !signedUp && !history.isActive('/signup')) {
      history.replaceState(null, '/signup');
    }
  }
  render() {
    return false;
  }
}

SignedUpRedirector.propTypes = {
  session: PropTypes.object
};

SignedUpRedirector.contextTypes = {
  history: PropTypes.any
};

export default connect(
  store => ({session: store.session})
)(SignedUpRedirector);
