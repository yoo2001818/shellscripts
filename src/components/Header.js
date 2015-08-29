import 'font-awesome/css/font-awesome.css';
import './style/Header.scss';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {
  render() {
    return (
      <header>
        <div className='container'>
          <div className='logo'>
            <Link to='/'>Sitename</Link>
          </div>
          <div className='search'>
            <div className='search-form'>
              <div className='search-text'>
                <input type='text' />
              </div>
              <div className='search-btn'>
                <button><i className='fa fa-search'></i></button>
              </div>
            </div>
          </div>
          <div className='session'>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  session: PropTypes.object
};

export default connect(
  state => ({session: state.session})
)(Header);
