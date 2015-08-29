import 'font-awesome/css/font-awesome.css';
import './style/Header.scss';

import React, { Component } from 'react';
import { Link } from 'react-router';

import SearchBar from './header/SearchBar.js';
import SessionBar from './header/SessionBar.js';

export default class Header extends Component {
  render() {
    return (
      <header>
        <div className='container'>
          <div className='logo'>
            <Link to='/'>Shellscripts</Link>
          </div>
          <SearchBar />
          <SessionBar />
        </div>
      </header>
    );
  }
}
