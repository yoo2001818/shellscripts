import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import reduxForm from 'redux-form';

import Alert from './Alert.js';
import Translated from './Translated.js';
import translate from '../lang/index.js';
import { localSignUp, checkUsername, checkEmail } from '../actions/session.js';

class LocalSignUpForm extends Component {
  handleSubmit(data) {
    this.props.dispatch(localSignUp(data));
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { username, email, password }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <input placeholder={__('username')} type='text' {...username}/>
        {username.error && username.touched ? (
          <Alert>{username.error}</Alert>
        ) : null }
        <input placeholder={__('email')} type='email' noValidate {...email}/>
        {email.error && email.touched ? (
          <Alert>{email.error}</Alert>
        ) : null }
        <input placeholder={__('password')} type='password' {...password}/>
        {password.error && password.touched ? (
          <Alert>{password.error}</Alert>
        ) : null }
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
  dispatch: PropTypes.func.isRequired
};

function validateFrom(data) {
  const errors = {};
  if (!data.username) {
    errors.username = 'Required';
  }
  if (!data.email) {
    errors.email = 'Required';
  }
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password can\'t be shorter than 6 characters';
  }
  return errors;
}

function validateFormAsync(data, dispatch) {
  return dispatch(checkUsername(data.username))
  .then(action => {
    const errors = {};
    if (!action.payload.body) {
      errors.username = 'Please use other username.';
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
