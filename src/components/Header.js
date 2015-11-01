import './style/Header.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import SearchBar from './SearchBar.js';
import SessionBar from './header/SessionBar.js';
import SignedUpRedirector from './SignedUpRedirector.js';
import siteLogo from '../assets/siteLogo.png';

export default class Header extends Component {
  render() {
    let searchBar = (<SearchBar />);
    let { history } = this.context;
    // const routes = this.context.router.getCurrentRoutes();
    if (history.isActive('/search')) searchBar = null;
    return (
      <header>
        <div className='container'>
          <div className='logo'>
            <Link to='/'>
              <img src={siteLogo} alt='Shellscripts' />
            </Link>
          </div>
          { searchBar }
          <SessionBar />
          <SignedUpRedirector />
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  history: PropTypes.any
};
