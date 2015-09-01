import 'font-awesome/css/font-awesome.css';
import './style/Header.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import SearchBar from './SearchBar.js';
import SessionBar from './header/SessionBar.js';

export default class Header extends Component {
  render() {
    let searchBar = (<SearchBar />);
    const routes = this.context.router.getCurrentRoutes();
    if (routes[1] && routes[1].path === '/search') searchBar = null;
    return (
      <header>
        <div className='container'>
          <div className='logo'>
            <Link to='/'>Shellscripts</Link>
          </div>
          { searchBar }
          <SessionBar />
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.func
};
