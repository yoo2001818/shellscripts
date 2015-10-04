import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PostSignUpForm from './forms/PostSignUpForm.js';
import Translated from './Translated.js';
import Dialog from './Dialog.js';

class PostSignUp extends Component {
  // TODO Logout when user leaves the page.
  render() {
    let { id } = this.props.session;
    let user = this.props.user.entities[id];
    return (
      <div>
        <p>
          <Translated name='signUpPostComplete'/>
        </p>
        <Dialog>
          <PostSignUpForm initialValues={user}/>
        </Dialog>
      </div>
    );
  }
}

PostSignUp.propTypes = {
  session: PropTypes.object,
  user: PropTypes.object,
  lang: PropTypes.object
};

export default connect(
  store => ({
    session: store.session,
    user: store.user,
    lang: store.lang
  })
)(PostSignUp);
