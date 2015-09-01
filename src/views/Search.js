import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setQuery, setTempQuery } from '../actions/search.js';

class Search extends Component {
  render() {
    const { query } = this.props.search;
    return (
      <div id="search">
        <h1>{`Search result for ${query}`}</h1>
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
