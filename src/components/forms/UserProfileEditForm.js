import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import reduxForm from 'redux-form';
import { isEmail, isURL } from 'validator';
import Dropzone from 'react-dropzone';

import Translated from '../Translated.js';
import ErrorInput from '../ErrorInput.js';
import translate from '../../lang/index.js';
import Overlay from '../Overlay.js';
import userPlaceholder from '../../assets/userPlaceholder.png';

import { setProfile, uploadPhoto } from '../../actions/user.js';

class UserProfileEditForm extends Component {
  handleDrop(files) {
    const file = files[0];
    if (file == null) return;
    this.props.dispatch(uploadPhoto(file));
  }
  handleSubmit(data) {
    this.props.dispatch(setProfile(this.props.user.username, data))
    .then(() => {
      this.handleCancelEdit();
    });
  }
  handleCancelEdit(e) {
    const { onDismiss } = this.props;
    if (onDismiss) onDismiss();
    e.preventDefault();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields, handleSubmit, user } = this.props;
    return (
      <div className='card'>
        <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
          <div className='photo'>
            <Dropzone ref='dropzone' onDrop={this.handleDrop.bind(this)}
              accept='image/*' className='dropzone' multiple={false}
              activeClassName='' rejectClassname=''>
              <img src={user.photo || userPlaceholder} />
              <Overlay>
                <i className='fa fa-plus'></i>
              </Overlay>
            </Dropzone>
          </div>
          <div className='content'>
            <div className='identity'>
              <input className='realname' type='text'
                placeholder={__('name')} {...fields.name}/>
              <p className='username'>{user.username}</p>
            </div>
            <div className='contact'>
              {/*
              Email is not editable now...
              <ErrorInput className='email' type='text'
                placeholder={__('email')} {...fields.email}/>
              */}
              <p className='email'>
                <i className="fa fa-envelope-o icon"></i>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </p>
              <ErrorInput className='website' type='text'
                placeholder={__('website')} {...fields.website}/>
            </div>
            <textarea className='bio' placeholder={__('bio')} {...fields.bio}/>
          </div>
          <div className='edit'>
            <button>
              <i className="fa fa-check"></i>
              <span className='description'>
                <Translated name='save' />
              </span>
            </button>
            <button onClick={this.handleCancelEdit.bind(this)}>
              <i className="fa fa-times"></i>
              <span className='description'>
                <Translated name='cancel' />
              </span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

UserProfileEditForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  invalid: PropTypes.bool,
  onDismiss: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object
};

function validateForm(data) {
  const errors = {};
  if (!isEmail(data.email)) {
    errors.email = true;
  }
  if (data.website && !isURL(data.website)) {
    errors.website = true;
  }
  return errors;
}

export default connect(
  store => ({form: store.form, lang: store.lang, session: store.session})
)(reduxForm({
  form: 'userProfileEdit',
  fields: ['name', 'email', 'website', 'bio'],
  validate: validateForm
})(UserProfileEditForm));
