import '../style/UserProfile.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import Translated from '../../components/ui/Translated.js';
import UserProfileEditForm from '../../components/forms/UserProfileEditForm.js';
import userPlaceholder from '../../assets/userPlaceholder.png';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  canEdit() {
    const { user, session, sessionUser } = this.props;
    return session.login === user.login || (sessionUser && sessionUser.isAdmin);
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
    const { user, selected } = this.props;
    let website = user.website;
    if (website && website.indexOf('://') == -1) {
      website = 'http://' + website;
    }
    // Editing should be immediately stopped if user signs out
    if (!this.canEdit()) editing = false;
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
              <a href={`mailto:${user.email}`} target='_blank'>{user.email}</a>
            </p>
            { user.website ? (
              <p className='website'>
                <i className="fa fa-link icon"></i>
                <a href={website} target='_blank'>{user.website}</a>
              </p>
            ) : false }
          </div>
          <p className='bio'>
            {user.bio}
          </p>
        </div>
        { !editing && this.canEdit() ? (
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
    return (
      <div id='user-profile'>
        <div className='small-content'>
          { card }
        </div>
        <div className='small-content tabs'>
          <Link to={`/${user.username}`}
            className={classNames('tab-entry', {
              selected: selected === 'entries'
            })}
          >작성한 스크립트</Link>
          <Link to={`/${user.username}/starred`}
            className={classNames('tab-entry', {
              selected: selected === 'starred'
            })}
          >별 준 스크립트</Link>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object,
  selected: PropTypes.string
};

const ConnectUserProfile = connect(
  (state) => {
    const { session, entities: { users } } = state;
    return {
      sessionUser: users[session.login],
      session
    };
  }
)(UserProfile);

export default ConnectUserProfile;
