import './style/SearchBar.scss';

import React, { Component, PropTypes } from 'react';
import { setTempQuery, setQuery } from '../actions/search.js';
import { connect } from 'react-redux';

class SearchBar extends Component {
  handleChange(e) {
    this.props.setTempQuery({
      query: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const { router } = this.context;
    this.props.setQuery({
      query: this.props.search.tempQuery,
      router
    });
  }
  render() {
    const query = this.props.search.tempQuery;
    return (
      <div className='search-bar'>
        <div className='search-form'>
          <form action='/search' method='get'
            onSubmit={this.handleSubmit.bind(this)}>
            <div className='search-text'>
              <input name='query' type='text' placeholder='Search'
                ref={this.props.refCallback}
                value={query} onChange={this.handleChange.bind(this)} />
            </div>
            <div className='search-btn'>
              <button><i className='fa fa-search'></i></button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

SearchBar.contextTypes = {
  router: PropTypes.func
};

SearchBar.propTypes = {
  search: PropTypes.object,
  setTempQuery: PropTypes.func.isRequired,
  setQuery: PropTypes.func.isRequired,
  refCallback: PropTypes.func
};

export default connect(
  store => ({ search: store.search }),
  { setTempQuery, setQuery }
)(SearchBar);
