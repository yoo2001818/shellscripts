import './style/UserMiniCard.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import userPlaceholder from '../assets/userPlaceholder.png';

export default class UserMiniCard extends Component {
  render() {
    const { user, hideUsername, hideName } = this.props;
    // Why are we using div tag instead of span?
    // Double clicking selects everything including near span tags.
    // display: inline-block doesn't.
    return (
      <div className='user-mini-card'>
        <Link to={`/${user.username}`}>
          <div className='photo'>
            <img src={user.photo || userPlaceholder} />
          </div>
          { !hideName ? (
            <div className='name'>
              {user.name}
            </div>
          ) : false }
          { !hideUsername ? (
            <div className='username'>
              {user.username}
            </div>
          ) : false }
        </Link>
      </div>
    );
  }
}

UserMiniCard.propTypes = {
  user: PropTypes.object.isRequired,
  hideUsername: PropTypes.bool,
  hideName: PropTypes.bool
};
