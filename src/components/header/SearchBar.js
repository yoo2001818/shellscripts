import React, { Component } from 'react';

export default class SearchBar extends Component {
  render() {
    return (
      <div className='search'>
        <div className='search-form'>
          <div className='search-text'>
            <input type='text' placeholder='Search' />
          </div>
          <div className='search-btn'>
            <button><i className='fa fa-search'></i></button>
          </div>
        </div>
      </div>
    );
  }
}
