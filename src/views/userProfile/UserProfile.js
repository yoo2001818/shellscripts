import '../style/UserProfile.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import Translated from '../../components/ui/Translated.js';
import UserProfileEditForm from '../../components/forms/UserProfileEditForm.js';
import userPlaceholder from '../../assets/userPlaceholder.png';
import { setEnabled } from '../../actions/user.js';

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
  canDisable() {
    const { user, session, sessionUser } = this.props;
    return sessionUser && sessionUser.isAdmin && session.login !== user.login;
  }
  handleDisable() {
    const { user } = this.props;
    this.props.setEnabled(user.username, !user.enabled);
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
            { user.showEmail || this.canDisable() ? (
              <p className='email'>
                <i className="fa fa-envelope-o icon"></i>
                <a href={`mailto:${user.email}`} target='_blank'>
                  {user.email}
                </a>
              </p>
            ) : false }
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
            { this.canDisable() ? (
              user.enabled ? (
                <button
                  onClick={this.handleDisable.bind(this)}
                  className='red-button'
                >
                  <i className="fa fa-ban"></i>
                  <span className='description'>
                    <Translated name='disable' />
                  </span>
                </button>
              ) : (
                <button
                  onClick={this.handleDisable.bind(this)}
                >
                  <i className="fa fa-check"></i>
                  <span className='description'>
                    <Translated name='enable' />
                  </span>
                </button>
              )
            ) : false }
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
          >
            <Translated name='authoredEntries' />
          </Link>
          <Link to={`/${user.username}/starred`}
            className={classNames('tab-entry', {
              selected: selected === 'starred'
            })}
          >
            <Translated name='starredEntries' />
          </Link>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object,
  selected: PropTypes.string,
  setEnabled: PropTypes.func
};

const ConnectUserProfile = connect(
  (state) => {
    const { session, entities: { users } } = state;
    return {
      sessionUser: users[session.login],
      session
    };
  },
  { setEnabled }
)(UserProfile);

export default ConnectUserProfile;
