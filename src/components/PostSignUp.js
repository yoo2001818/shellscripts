import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PostSignUpForm from './PostSignUpForm.js';
import Translated from './Translated.js';
import Dialog from './Dialog.js';

class PostSignUp extends Component {
  // TODO Logout when user leaves the page.
  render() {
    return (
      <div>
        <p>
          <Translated name='signUpPostComplete'/>
        </p>
        <Dialog>
          <PostSignUpForm initialValues={this.props.session}/>
        </Dialog>
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
