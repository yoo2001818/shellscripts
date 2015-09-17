import 'font-awesome/css/font-awesome.css';
import './style/Header.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import SearchBar from './SearchBar.js';
import SessionBar from './header/SessionBar.js';
import Translated from './Translated.js';

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
              <Translated name='sitename' />
            </Link>
          </div>
          { searchBar }
          <SessionBar />
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  history: PropTypes.any
};
