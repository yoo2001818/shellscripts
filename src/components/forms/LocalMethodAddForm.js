import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Translated from '../ui/Translated.js';
import ErrorInput from '../ui/ErrorInput.js';
import translate from '../../lang/index.js';
import { localSignUp } from '../../actions/session.js';

class LocalMethodAddForm extends Component {
  handleSubmit(data) {
    this.props.dispatch(localSignUp(Object.assign({}, data, {
      username: this.props.user.username,
      email: this.props.user.email
    })));
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { password, passwordCheck }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className='content'>
          <ErrorInput placeholder={__('password')} type='password'
            {...password} />
          <ErrorInput placeholder={__('passwordCheck')} type='password'
            {...passwordCheck} />
        </div>
        <div className='footer right'>
          <button>
            <Translated name='register' />
          </button>
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
  invalid: PropTypes.bool
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
  form: 'localMethodAdd',
  fields: ['password', 'passwordCheck'],
  validate: validateFrom
})(LocalMethodAddForm));
