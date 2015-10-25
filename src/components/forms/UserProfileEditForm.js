import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isEmail, isURL, isLength } from 'validator';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';

import DialogOverlay from '../ui/DialogOverlay.js';
import Translated from '../ui/Translated.js';
import ErrorInput from '../ui/ErrorInput.js';
import ErrorShow from '../ui/ErrorShow.js';
import translate from '../../lang/index.js';
import Overlay from '../ui/Overlay.js';
import userPlaceholder from '../../assets/userPlaceholder.png';

import { setProfile, uploadPhoto } from '../../actions/user.js';

// Uh... why is it here?
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}

class UserProfileEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cropper: null,
      scale: 1
    };
  }
  handleScale() {
    this.setState({
      scale: this.refs.scale.getDOMNode().value
    });
  }
  handleUploadPhoto(e) {
    const { cropper } = this.refs;
    // Retrieve image URL...
    let dataURL = cropper.getImage();
    this.props.dispatch(uploadPhoto(this.props.user.username,
      dataURLtoBlob(dataURL)))
    .then(() => {
      this.setState({
        cropper: null
      });
    });
    e.preventDefault();
  }
  handleCancelPhoto(e) {
    this.setState({
      cropper: null
    });
    e.preventDefault();
  }
  handleDrop(files) {
    const file = files[0];
    if (file == null) return;
    let reader = new FileReader();
    reader.onload = (e) => {
      this.setState({
        cropper: e.target.result,
        scale: 1
      });
    };
    reader.readAsDataURL(file);
    //this.props.dispatch(uploadPhoto(file));
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
    if (e) e.preventDefault();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { cropper } = this.state;
    const { fields, handleSubmit, user, load } = this.props;
    const { loading } = load;
    return (
      <div className='card'>
        <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
          <div className='photo'>
            <Dropzone ref='dropzone' onDrop={this.handleDrop.bind(this)}
              accept='image/*' className='dropzone' multiple={false}
              activeClassName='' rejectClassname=''>
              <img src={user.photo || userPlaceholder} />
              <Overlay className='loading'>
                <i className='fa fa-plus'></i>
              </Overlay>
            </Dropzone>
          </div>
          <div className='content'>
            <div className='identity'>
              <ErrorInput className='realname' type='text'
                placeholder={__('name')} noSuccess {...fields.name}/>
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
            <ErrorShow {...fields.bio}>
              <textarea className='bio' placeholder={__('bio')}
                {...fields.bio}/>
            </ErrorShow>
          </div>
          <div className='edit'>
            <button>
              <i className="fa fa-check"></i>
              <span className='description'>
                <Translated name='save' />
              </span>
            </button>
            <button className='red-button'
              onClick={this.handleCancelEdit.bind(this)}
            >
              <i className="fa fa-times"></i>
              <span className='description'>
                <Translated name='cancel' />
              </span>
            </button>
          </div>
          { cropper ? (
            <DialogOverlay title={__('setProfilePhoto')} className='large'
              loading={loading} >
              <AvatarEditor image={cropper} ref='cropper'
                width={256} height={256} border={50}
                color={[0, 0, 0, 0.6]} scale={this.state.scale}
              />
              <input name='scale' type='range' ref='scale'
                onChange={this.handleScale.bind(this)}
                min='1' max='3' step='0.01' defaultValue='1' />
              <div className='footer linear'>
                <button onClick={this.handleUploadPhoto.bind(this)}>
                  <Translated name='save' />
                </button>
                <button onClick={this.handleCancelPhoto.bind(this)}>
                  <Translated name='cancel' />
                </button>
              </div>
            </DialogOverlay>
          ) : false}
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
  user: PropTypes.object,
  load: PropTypes.object
};

function validateForm(data) {
  const errors = {};
  if (!isEmail(data.email)) {
    errors.email = true;
  }
  if (data.website && !isURL(data.website)) {
    errors.website = true;
  }
  if (!isLength(data.name, 0, 64)) {
    errors.name = {
      id: 'FIELD_TOO_LONG'
    };
  }
  if (!isLength(data.bio, 0, 280)) {
    errors.bio = {
      id: 'FIELD_TOO_LONG'
    };
  }
  return errors;
}

export default connect(
  store => ({
    form: store.form,
    lang: store.lang,
    load: store.load
  })
)(reduxForm({
  form: 'userProfileEdit',
  fields: ['name', 'email', 'website', 'bio'],
  validate: validateForm
})(UserProfileEditForm));
