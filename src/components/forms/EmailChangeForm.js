import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { User } from '../../validation/schema.js';
import validate from '../../validation/validate.js';

import { setEmail } from '../../actions/user.js';
import Translated from '../ui/Translated.js';
import ErrorInput from '../ui/ErrorInput.js';
import LabelInput from '../ui/LabelInput.js';
import translate from '../../lang/index.js';

class EmailChangeForm extends Component {
  handleSubmit(data) {
    this.props.dispatch(setEmail(this.props.user.username, data));
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { email, showEmail }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <LabelInput label={__('email')} className='oneline'>
          <ErrorInput placeholder={__('email')} type='email' {...email} />
        </LabelInput>
        <LabelInput label={__('showEmailName')} className='oneline'>
          <input type='checkbox' {...showEmail} />
        </LabelInput>
        <div className='footer'>
          <button disabled={this.props.invalid}>
            <Translated name='save' />
          </button>
        </div>
      </form>
    );
  }
}

EmailChangeForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  dirty: PropTypes.bool,
  invalid: PropTypes.bool
};

function validateFrom(data) {
  const errors = validate(data, User);
  return errors;
}

export default connect(
  state => {
    const { session, lang, form, entities: { users } } = state;
    const user = users[session.login];
    return { user, lang, form };
  }
)(reduxForm({
  form: 'emailChange',
  fields: ['email', 'showEmail'],
  validate: validateFrom
})(EmailChangeForm));
