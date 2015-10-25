import './style/UserProfile.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { loadUserList, loadUserListMore } from '../actions/entry.js';
import Translated from '../components/ui/Translated.js';
import UserProfileEditForm from '../components/forms/UserProfileEditForm.js';
import EntryMiniCard from '../components/EntryMiniCard.js';
import InfiniteScroll from '../components/ui/InfiniteScroll.js';
import userPlaceholder from '../assets/userPlaceholder.png';

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
  handleLoadList() {
    return this.props.loadUserListMore(this.props.user.username)
    .then(action => {
      if (!action) return;
      if (action.error) throw action;
      return action;
    });
  }
  render() {
    let { editing } = this.state;
    const { user, list, entries } = this.props;
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
                <a href={user.website} target='_blank'>{user.website}</a>
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
    let docTitle = user.username;
    if (user.name) docTitle = `${user.name} (${user.username})`;
    const renderList = (list && list.ids &&
      list.ids.map(id => entries[id]).map((entry, key) => {
        return (
          <EntryMiniCard key={key} entry={entry} hideUser={true} />
        );
      })) || [];
    return (
      <div id='user-profile'>
        <Helmet title={docTitle} />
        <div className='small-content'>
          { card }
        </div>
        <div className='small-content'>
          <InfiniteScroll
            loadMore={this.handleLoadList.bind(this)}
            hasMore={list && !list.finished}
            loader={(
              <div className='loading content'>
                <i className="fa fa-refresh fa-spin"></i>
              </div>
            )}
            errorRetry={(
              <button onClick={this.handleLoadList.bind(this)}>
                <Translated name='retry' />
              </button>
            )}
          >
            { renderList }
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object,
  entries: PropTypes.object,
  list: PropTypes.object,
  loadUserListMore: PropTypes.func.isRequired
};

const ConnectUserProfile = connect(
  (state, props) => {
    const { session, entry, entities: { users, entries } } = state;
    const { user } = props;
    return {
      sessionUser: users[session.login],
      list: entry.userList[user.login],
      entries, session
    };
  },
  { loadUserListMore }
)(UserProfile);

ConnectUserProfile.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(loadUserList(params.username));
};

export default ConnectUserProfile;
