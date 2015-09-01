import './style/Search.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setQuery, setTempQuery } from '../actions/search.js';
import SearchBar from '../components/SearchBar.js';

class Search extends Component {
  handleSearchBar(searchBar) {
    if (searchBar == null) return;
    if (this.handledFocus) return;
    // Focus to input text
    const domNode = searchBar.getDOMNode();
    domNode.focus();
    // Set cursor on the end
    const value = domNode.value;
    domNode.value = '';
    domNode.value = value;
    this.handledFocus = true;
  }
  render() {
    return (
      <div id="search">
        <SearchBar refCallback={this.handleSearchBar.bind(this)} />
        <p>
          {`Results come here`}
        </p>
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object
};

const ConnectSearch = connect(
  store => ({search: store.search})
)(Search);

ConnectSearch.fetchData = function(store, routerState) {
  // Set store according to the query
  const { query } = routerState.query;
  return store.dispatch(setQuery({
    query
  }));
  // fetchData MUST return a Promise
};

ConnectSearch.willTransitionFrom = function(transition, component) {
  if (transition.path.slice(0, 7) === '/search') return;
  component.dispatchProps.dispatch(setTempQuery({
    query: ''
  }));
};

export default ConnectSearch;
