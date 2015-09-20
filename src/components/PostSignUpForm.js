import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import reduxForm from 'redux-form';
import { isEmail } from 'validator';

import Translated from './Translated.js';
import ErrorInput from './ErrorInput.js';
import translate from '../lang/index.js';
import { localSignUp, checkUsername, checkEmail } from '../actions/session.js';

class PostSignUpForm extends Component {
  handleSubmit(data) {
    //this.props.dispatch(localSignUp(data));
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { username, email }, handleSubmit,
      invalid } = this.props;
    return (
      <div className='form'>
        <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
          <ErrorInput placeholder={__('username')} type='text' {...username}
          disabled={this.props.session.username} />
          <ErrorInput placeholder={__('email')} type='email' {...email}
          disabled={this.props.session.email} />
          <div className='footer'>
            <button disabled={invalid}>
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
  dispatch: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  invalid: PropTypes.bool
};

function validateFrom(data) {
  const errors = {};
  if (!data.username) {
    errors.username = true;
  }
  if (!isEmail(data.email)) {
    errors.email = true;
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
  store => ({form: store.form, lang: store.lang, session: store.session})
)(reduxForm({
  form: 'postSignUp',
  fields: ['username', 'email'],
  validate: validateFrom,
  asyncValidate: validateFormAsync,
  asyncBlurFields: ['username']
})(PostSignUpForm));
