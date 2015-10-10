import './style/User.scss';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';
import { load } from '../actions/user.js';
import NotFound from './NotFound.js';

class User extends Component {
  render() {
    const { users } = this.props;
    const user = users[this.props.params.username.toLowerCase()];
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
  users: PropTypes.object,
  children: PropTypes.object
};

const ConnectUser = connect(
  store => ({users: store.entities.users}),
  { load }
)(User);

ConnectUser.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.username));
};

export default ConnectUser;
