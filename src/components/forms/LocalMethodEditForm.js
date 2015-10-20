import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Translated from '../ui/Translated.js';
import ErrorInput from '../ui/ErrorInput.js';
import translate from '../../lang/index.js';
import { localChangePassword, confirmMethodDelete }
  from '../../actions/session.js';

class LocalMethodAddForm extends Component {
  handleDelete(e) {
    this.props.dispatch(confirmMethodDelete('local'));
    e.preventDefault();
  }
  handleSubmit(data) {
    return this.props.dispatch(localChangePassword(data, {
      errors: [401]
    }))
    .then(result => {
      if (result.error) {
        const error = result.payload.body;
        if (error.id === 'AUTH_INVALID_PASSWORD') {
          this.props.fields.oldPassword.handleChange('');
          throw {oldPassword: error};
        }
        throw {_error: error.message};
      } else {
        this.props.resetForm();
      }
    });
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { oldPassword, password, passwordCheck },
      handleSubmit, canDelete } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className='content'>
          <ErrorInput placeholder={__('oldPassword')} type='password'
            {...oldPassword} />
          <ErrorInput placeholder={__('newPassword')} type='password'
            {...password} />
          <ErrorInput placeholder={__('passwordCheck')} type='password'
            {...passwordCheck} />
        </div>
        <div className='footer right'>
          <button>
            <Translated name='change' />
          </button>
          { canDelete ? (
            <button className='red-button'
              onClick={this.handleDelete.bind(this)}
            >
              <Translated name='unregister' />
            </button>
          ) : (
            <button disabled>
              <Translated name='unregister' />
            </button>
          )}
        </div>
      </form>
    );
  }
}

LocalMethodAddForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  invalid: PropTypes.bool,
  resetForm: PropTypes.func.isRequired,
  canDelete: PropTypes.bool
};

function validateFrom(data) {
  const errors = {};
  if (!data.password || data.password.length < 6) {
    errors.password = {
      id: 'AUTH_PASSWORD_POLICY'
    };
  }
  if (data.password !== data.passwordCheck) {
    errors.passwordCheck = true;
  }
  return errors;
}

export default connect(
  state => {
    const { session, entities: { users }, lang, form } = state;
    const user = users[session.login];
    return { form, lang, user };
  }
)(reduxForm({
  form: 'localMethodEdit',
  fields: ['oldPassword', 'password', 'passwordCheck'],
  validate: validateFrom
})(LocalMethodAddForm));
