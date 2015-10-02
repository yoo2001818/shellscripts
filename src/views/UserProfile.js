import './style/UserProfile.scss';

import React, { Component, PropTypes } from 'react';
import userPlaceholder from '../assets/userPlaceholder.png';

export default class UserProfile extends Component {
  render() {
    const { user } = this.props;
    return (
      <div id='user-profile'>
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
              {user.website ? (
                <p className='website'>
                  <i className="fa fa-link icon"></i>
                  <a href={user.website} target='_blank'>{user.website}</a>
                </p>
              ) : false}
            </div>
            <p className='bio'>
              {user.bio}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  user: PropTypes.object
};
