import './style/UserProfile.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Translated from '../components/Translated.js';
import UserProfileEditForm from '../components/forms/UserProfileEditForm.js';
import userPlaceholder from '../assets/userPlaceholder.png';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  handleStartEdit() {
    this.setState({
      editing: true
    });
  }
  handleCancelEdit() {
    this.setState({
      editing: false
    });
  }
  render() {
    let { editing } = this.state;
    const { user, session } = this.props;
    // Editing should be immediately stopped if user signs out
    if (session.id !== user.id) editing = false;
    // TODO This is a mess. We should seperate editing page / viewing page -_-
    const card = editing ? (
      <UserProfileEditForm initialValues={user} user={user}
        onDismiss={this.handleCancelEdit.bind(this)} />
    ) : (
      <div className='card'>
        <div className='photo'>
          <img src={user.photo || userPlaceholder} />
        </div>
        <div className='content'>
          <div className='identity'>
            <h1 className='realname'>{user.name || user.username}</h1>
            <p className='username'>{user.username}</p>
          </div>
          <div className='contact'>
            <p className='email'>
              <i className="fa fa-envelope-o icon"></i>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
            { user.website ? (
              <p className='website'>
                <i className="fa fa-link icon"></i>
                <a href={user.website} target='_blank'>{user.website}</a>
              </p>
            ) : false }
          </div>
          <p className='bio'>
            {user.bio}
          </p>
        </div>
        { !editing && session.id === user.id ? (
          <div className='edit'>
            <button onClick={this.handleStartEdit.bind(this)}>
              <i className="fa fa-pencil"></i>
              <span className='description'>
                <Translated name='edit' />
              </span>
            </button>
          </div>
        ) : false }
      </div>
    );
    let docTitle = user.username;
    if (user.name) docTitle = `${user.name} (${user.username})`;
    return (
      <div id='user-profile'>
        <Helmet title={docTitle} />
        { card }
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object
};

export default connect(
  store => ({session: store.session})
)(UserProfile);
