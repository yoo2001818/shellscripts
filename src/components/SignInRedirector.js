import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class SignInRedirector extends Component {
  componentWillMount() {
    let { id } = this.props.session;
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (id === false) {
      history.replaceState(null, '/login');
    }
  }
  componentDidUpdate() {
    let { id } = this.props.session;
    let { history } = this.context;
    // Redirect if user hasn't signed in.
    if (id === false) {
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
