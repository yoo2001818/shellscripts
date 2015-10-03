import './style/Search.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import qs from 'qs';
import { setQuery, setTempQuery } from '../actions/search.js';
import SearchBar from '../components/SearchBar.js';
import translate from '../lang/index.js';

class Search extends Component {
  componentWillUnmount() {
    this.props.setTempQuery({
      query: ''
    });
  }
  handleSearchBar(searchBar) {
    if (searchBar == null) return;
    if (this.handledFocus) return;
    // Focus to input text
    const domNode = searchBar.getDOMNode();
    domNode.focus();
    // Set cursor on the end
    const { tempQuery } = this.props.search;
    domNode.value = '';
    domNode.value = tempQuery;
    this.handledFocus = true;
  }
  render() {
    const __ = translate(this.props.lang.lang);
    let innerContent;
    const { load, query } = this.props.search;
    if (load.loading) {
      innerContent = (
        <div className='loading'>
          <i className="fa fa-refresh fa-spin"></i>
        </div>
      );
    } else {
      innerContent = (
        <p>Results come here</p>
      );
    }
    return (
      <div id="search">
        <Helmet title={__('searchTitle', [query])} />
        <SearchBar refCallback={this.handleSearchBar.bind(this)} />
        <div className='content'>
          { innerContent }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object,
  lang: PropTypes.lang,
  setTempQuery: PropTypes.func
};

const ConnectSearch = connect(
  store => ({search: store.search, lang: store.lang}),
  { setTempQuery }
)(Search);

ConnectSearch.fetchData = function(store, routerState) {
  // Set store according to the query
  const { query } = qs.parse(routerState.location.search.slice(1));
  return store.dispatch(setQuery({
    query
  }));
  // fetchData MUST return a Promise
};

export default ConnectSearch;
