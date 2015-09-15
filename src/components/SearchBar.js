import './style/SearchBar.scss';

import React, { Component, PropTypes } from 'react';
import { setTempQuery, setQuery } from '../actions/search.js';
import { connect } from 'react-redux';
import translate from '../lang/index.js';

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
    const __ = translate(this.props.lang.lang);
    const query = this.props.search.tempQuery;
    return (
      <div className='search-bar'>
        <div className='search-form'>
          <form action='/search' method='get'
            onSubmit={this.handleSubmit.bind(this)}>
            <input name='query' type='text' placeholder={__('search')}
              ref={this.props.refCallback}
              value={query} onChange={this.handleChange.bind(this)} />
            <button><i className='fa fa-search'></i></button>
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
  lang: PropTypes.object,
  search: PropTypes.object,
  setTempQuery: PropTypes.func.isRequired,
  setQuery: PropTypes.func.isRequired,
  refCallback: PropTypes.func
};

export default connect(
  store => ({ search: store.search, lang: store.lang }),
  { setTempQuery, setQuery }
)(SearchBar);
