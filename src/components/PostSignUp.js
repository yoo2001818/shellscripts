import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PostSignUpForm from './PostSignUpForm.js';

class PostSignUp extends Component {
  // TODO Logout when user leaves the page.
  render() {
    return (
      <div>
        <p>123123123</p>
        <PostSignUpForm initialValues={this.props.session}/>
      </div>
    );
  }
}

PostSignUp.propTypes = {
  session: PropTypes.object,
  lang: PropTypes.object
};

export default connect(
  store => ({session: store.session, lang: store.lang})
)(PostSignUp);
