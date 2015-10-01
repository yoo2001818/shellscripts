import './style/User.scss';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';
import { load } from '../actions/user.js';
import NotFound from './NotFound.js';

function getUserByUsername(user, username) {
  if (username == null) return null;
  const { entities, usernames } = user;
  const userId = usernames[username.toLowerCase()];
  if (userId === null) return null;
  return entities[userId];
}

class User extends Component {
  render() {
    const user = getUserByUsername(this.props.user, this.props.params.username);
    console.log(user);
    if (user) {
      // Inject user, that's it.
      return cloneElement(this.props.children, { user });
    } else if (user === null) {
      // Display 404 if we can't find one
      return <NotFound />;
    } else {
      // Loading! :P
      return (
        <div id='user'>
          <div className='loading'>
            <i className="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      );
    }
  }
}

User.propTypes = {
  params: PropTypes.object,
  user: PropTypes.object,
  children: PropTypes.object
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
