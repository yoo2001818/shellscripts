import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { User } from '../../validation/schema.js';
import validate from '../../validation/validate.js';

import Translated from '../ui/Translated.js';
import ErrorInput from '../ui/ErrorInput.js';
import translate from '../../lang/index.js';
import { localSignUp, checkUsername } from '../../actions/session.js';

class LocalSignUpForm extends Component {
  handleSubmit(data) {
    return this.props.dispatch(localSignUp(data))
    .then(result => {
      if (result.error) {
        const error = result.payload.body;
        throw {_error: error.message};
      } else {
        this.context.history.pushState(null, '/');
      }
    });
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

LocalSignUpForm.contextTypes = {
  history: PropTypes.object
};

function validateFrom(data) {
  const errors = validate(data, User);
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
