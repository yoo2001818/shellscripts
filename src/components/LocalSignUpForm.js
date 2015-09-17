import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { connectReduxForm } from 'redux-form';

import Translated from './Translated.js';
import translate from '../lang/index.js';
import { localSignUp } from '../actions/session.js';

class LocalSignUpForm extends Component {
  onSubmit(data) {
    this.props.localSignUp(data);
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { username, email, password }, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <input placeholder={__('username')} type='text' {...username}/>
        <input placeholder={__('email')} type='email' {...email}/>
        <input placeholder={__('password')} type='password' {...password}/>
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
  localSignUp: PropTypes.func.isRequired
};

export default connectReduxForm({
  form: 'localSignUp',
  fields: ['username', 'email', 'password']
})(connect(
  store => ({session: store.session, lang: store.lang}),
  { localSignUp }
)(LocalSignUpForm));
