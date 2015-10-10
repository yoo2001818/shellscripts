import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Translated from '../Translated.js';
import ErrorInput from '../ErrorInput.js';
import translate from '../../lang/index.js';
import { login } from '../../actions/session.js';
import Alert from '../Alert.js';

class LocalLoginForm extends Component {
  handleSubmit(data) {
    return this.props.dispatch(login(data, {
      errors: [401]
    })).then(result => {
      if (result.error) {
        const error = result.payload.body;
        if (error.id === 'AUTH_INVALID_USERNAME') {
          throw {username: error};
        }
        if (error.id === 'AUTH_INVALID_PASSWORD') {
          throw {password: error};
        }
        throw {_error: error.message};
      }
    });
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { username, password }, handleSubmit, error } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        {
          error ? (
            <Alert>
              {error}
            </Alert>
          ) : null
        }
        <ErrorInput placeholder={__('username')} type='text' {...username}
          noSuccess/>
        <ErrorInput placeholder={__('password')} type='password' {...password}
          noSuccess/>
        <div className='footer'>
          <button>
            <Translated name='signIn' />
          </button>
        </div>
      </form>
    );
  }
}

LocalLoginForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.any
};

function validateFrom(data) {
  const errors = {};
  if (!data.username) errors.username = true;
  if (!data.password) errors.password = true;
  return errors;
}

export default connect(
  store => ({form: store.form, lang: store.lang})
)(reduxForm({
  form: 'localLogin',
  fields: ['username', 'password'],
  validate: validateFrom
})(LocalLoginForm));
