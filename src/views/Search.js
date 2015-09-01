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
    const { tempQuery } = this.props.search;
    domNode.value = '';
    domNode.value = tempQuery;
    this.handledFocus = true;
  }
  render() {
    let innerContent;
    const { load } = this.props.search;
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
        <SearchBar refCallback={this.handleSearchBar.bind(this)} />
        <div className='content'>
          { innerContent }
        </div>
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
