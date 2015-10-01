import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { load } from '../actions/user.js';
import NotFound from './NotFound.js';

function getUserByUsername(user, username) {
  if (username == null) return null;
  const { entities, usernames } = user;
  const userId = usernames[username];
  if (userId === null) return null;
  return entities[userId];
}

class User extends Component {
  render() {
    const user = getUserByUsername(this.props.user, this.props.params.username);
    if (user) {
      return (
        <div>
          <h1>User {user.username}</h1>
          <img src={user.photo} />
          <p>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </p>
          {JSON.stringify(user)}
        </div>
      );
    } else if (user === null) {
      // Display 404 if we can't find one
      return <NotFound />;
    } else {
      // Loading! :P
      return (
        <div className='loading'>
          <i className="fa fa-refresh fa-spin"></i>
        </div>
      );
    }
  }
}

User.propTypes = {
  params: PropTypes.object,
  user: PropTypes.object
};

const ConnectUser = connect(
  store => ({user: store.user}),
  { load }
)(User);

ConnectUser.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.username));
};

export default ConnectUser;
