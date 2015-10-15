import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isEmail, isAlphanumeric, isLength } from 'validator';

import Translated from '../ui/Translated.js';
import ErrorInput from '../ui/ErrorInput.js';
import translate from '../../lang/index.js';
import { checkUsername, signUpFinalize } from '../../actions/session.js';

class PostSignUpForm extends Component {
  handleSubmit(data) {
    this.props.dispatch(signUpFinalize(data));
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { username, email }, handleSubmit, user } = this.props;
    if (user == null) return false;
    return (
      <div className='form'>
        <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
          <ErrorInput placeholder={__('username')} type='text' {...username}
            disabled={user.username}/>
          <ErrorInput placeholder={__('email')} type='email' {...email} />
          <div className='footer'>
            <button>
              <Translated name='done' />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

PostSignUpForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  invalid: PropTypes.bool
};

// Seriously though this is exactly same as LocalSignUpForm.

function validateFrom(data) {
  const errors = {};
  if (!isAlphanumeric(data.username)) {
    errors.username = {
      id: 'AUTH_USERNAME_POLICY'
    };
  }
  if (!isLength(data.username, 0, 32)) {
    errors.username = {
      id: 'FIELD_TOO_LONG'
    };
  }
  if (!isEmail(data.email)) {
    errors.email = true;
  }
  return errors;
}

function validateFormAsync(data, dispatch) {
  // This is likely to be a bug if we already have username, but since that
  // never happens (at least for now), we don't really have to resolve that
  // issue. Additionally, redux-router should return store object to here
  // if we want to implement that. Which means I'll need to report an issue
  // to resolve this. (Not sure the author of redux-router will accept this
  // issue though.)
  return dispatch(checkUsername(data.username))
  .then(action => {
    const errors = {};
    if (!action.error) {
      errors.username = {
        id: 'AUTH_USERNAME_EXISTS'
      };
    }
    return errors;
  });
}

export default connect(
  store => {
    const { session, entities: { users }, form, lang } = store;
    const user = users[session.login];
    return { session, user, form, lang };
  }
)(reduxForm({
  form: 'postSignUp',
  fields: ['username', 'email'],
  validate: validateFrom,
  asyncValidate: validateFormAsync,
  asyncBlurFields: ['username']
})(PostSignUpForm));
