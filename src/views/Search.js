import './style/Search.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import qs from 'qs';
import { setQuery, setTempQuery, loadList, loadListMore }
  from '../actions/search.js';
import SearchBar from '../components/SearchBar.js';
import SortOrderSelect from '../components/SortOrderSelect.js';
import translate from '../lang/index.js';
import InfiniteScroll from '../components/ui/InfiniteScroll.js';
import Translated from '../components/ui/Translated.js';
import EntryMiniCard from '../components/EntryMiniCard.js';

class Search extends Component {
  handleLoad() {
    return this.props.loadListMore()
    .then(action => {
      if (!action) return;
      if (action.error) throw action;
      return action;
    });
  }
  handleChange(type) {
    this.props.loadList(null, type);
  }
  componentWillUnmount() {
    this.props.setTempQuery({
      query: ''
    });
  }
  handleSearchBar(searchBar) {
    if (searchBar == null) return;
    if (this.handledFocus) return;
    // Focus to input text
    const domNode = searchBar;
    domNode.focus();
    // Set cursor on the end
    const { tempQuery } = this.props.search;
    domNode.value = '';
    domNode.value = tempQuery;
    this.handledFocus = true;
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { query, list } = this.props.search;
    const { entities } = this.props;
    const entries = list.ids.map(id => entities.entries[id]);
    const renderList = entries.map((entry, key) => {
      return (
        <EntryMiniCard key={key} entry={entry} />
      );
    });
    return (
      <div id="search">
        <Helmet title={__('searchTitle', [query])} />
        <SearchBar refCallback={this.handleSearchBar.bind(this)} />
        <div className='content small-content'>
          { query ? (
            <div>
              <SortOrderSelect
                list={list} onChange={this.handleChange.bind(this)}
              />
              <InfiniteScroll
                loadMore={this.handleLoad.bind(this)}
                hasMore={!list.finished}
                loader={(
                  <div className='loading content'>
                    <i className="fa fa-refresh fa-spin"></i>
                  </div>
                )}
                errorRetry={(
                  <button onClick={this.handleLoad.bind(this)}>
                    <Translated name='retry' />
                  </button>
                )}
              >
                {renderList}
                { list && list.ids.length == 0 ? (
                  <p>
                    <Translated name='searchNoResult' />
                  </p>
                ) : false }
              </InfiniteScroll>
            </div>
          ) : false }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object,
  lang: PropTypes.object,
  setTempQuery: PropTypes.func,
  entities: PropTypes.object,
  loadList: PropTypes.func.isRequired,
  loadListMore: PropTypes.func.isRequired
};

const ConnectSearch = connect(
  store => ({search: store.search, lang: store.lang, entities: store.entities}),
  { setTempQuery, loadListMore, loadList }
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
