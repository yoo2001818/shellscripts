import './style/Settings.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import SignInRedirector from '../components/SignInRedirector.js';
import Translated from '../components/ui/Translated.js';

export default class Settings extends Component {
  render() {
    return (
      <div id='settings'>
        <div className='sidebar'>
          <div className='box'>
            <h1>
              <Translated name='settings' />
            </h1>
            <ul>
              <li>
                <Link to='/settings'>
                  <Translated name='account' />
                </Link>
              </li>
              <li>
                <Link to='/settings/authMethods'>
                  <Translated name='authMethods' />
                </Link>
              </li>
              {/* One day we'll make this. One day.
              <li>
                <Link to='/settings/notifications'>
                  <Translated name='notifications' />
                </Link>
              </li>
              */}
            </ul>
          </div>
        </div>
        <div className='content'>
          {this.props.children}
        </div>
        <SignInRedirector />
      </div>
    );
  }
}

Settings.propTypes = {
  children: PropTypes.any
};
