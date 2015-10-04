import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SignedUpRedirector extends Component {
  componentWillMount() {
    let { id } = this.props.session;
    let user = this.props.user.entities[id];
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (id !== false && !user.signedUp && !history.isActive('/signup')) {
      history.replaceState(null, '/signup');
    }
  }
  componentDidUpdate() {
    let { id } = this.props.session;
    let user = this.props.user.entities[id];
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (id !== false && !user.signedUp && !history.isActive('/signup')) {
      history.replaceState(null, '/signup');
    }
  }
  render() {
    return false;
  }
}

SignedUpRedirector.propTypes = {
  session: PropTypes.object,
  user: PropTypes.object
};

SignedUpRedirector.contextTypes = {
  history: PropTypes.any
};

export default connect(
  store => ({
    session: store.session,
    user: store.user
  })
)(SignedUpRedirector);
