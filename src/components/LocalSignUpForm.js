import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import reduxForm from 'redux-form';
import { isEmail, isAlphanumeric } from 'validator';

import Translated from './Translated.js';
import ErrorInput from './ErrorInput.js';
import translate from '../lang/index.js';
import { localSignUp, checkUsername } from '../actions/session.js';

class LocalSignUpForm extends Component {
  handleSubmit(data) {
    this.props.dispatch(localSignUp(data));
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { username, email, password }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <ErrorInput placeholder={__('username')} type='text' {...username}
          asyncValidating={this.props.asyncValidating}/>
        <ErrorInput placeholder={__('email')} type='email' {...email}/>
        <ErrorInput placeholder={__('password')} type='password' {...password}/>
        <div className='footer'>
          <button>
            <Translated name='signUp' />
          </button>
        </div>
      </form>
    );
  }
}

LocalSignUpForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  asyncValidating: PropTypes.bool
};

function validateFrom(data) {
  const errors = {};
  if (!isAlphanumeric(data.username)) {
    errors.username = {
      id: 'AUTH_USERNAME_POLICY'
    };
  }
  if (!isEmail(data.email)) {
    errors.email = true;
  }
  if (!data.password || data.password.length < 6) {
    errors.password = {
      id: 'AUTH_PASSWORD_POLICY'
    };
  }
  return errors;
}

function validateFormAsync(data, dispatch) {
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
  store => ({form: store.form, lang: store.lang})
)(reduxForm({
  form: 'localSignUp',
  fields: ['username', 'email', 'password'],
  validate: validateFrom,
  asyncValidate: validateFormAsync,
  asyncBlurFields: ['username']
})(LocalSignUpForm));
