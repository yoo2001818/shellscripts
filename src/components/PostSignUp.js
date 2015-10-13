import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import PostSignUpForm from './forms/PostSignUpForm.js';
import Translated from './ui/Translated.js';
import Dialog from './ui/Dialog.js';

class PostSignUp extends Component {
  // TODO Logout when user leaves the page.
  render() {
    let user = this.props.user;
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
  store => {
    const { session, entities: { users }, lang } = store;
    const user = users[session.login];
    return { session, user, lang };
  }
)(PostSignUp);
