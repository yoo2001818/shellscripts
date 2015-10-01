import React, { Component, PropTypes } from 'react';

import userPlaceholder from './assets/userPlaceholder.png';

export default class UserProfile extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <h1>User {user.username}</h1>
        <img src={user.photo || userPlaceholder} />
        <p>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
        {JSON.stringify(user)}
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object
};
