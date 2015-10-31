import React, { Component, PropTypes } from 'react';
import { fetchList, loadList, loadListMore } from '../actions/entry.js';
import { connect } from 'react-redux';
import InfiniteScroll from '../components/ui/InfiniteScroll.js';
import Translated from '../components/ui/Translated.js';
import EntryMiniCard from '../components/EntryMiniCard.js';
import SortOrderSelect from '../components/SortOrderSelect.js';
import Helmet from 'react-helmet';

class Index extends Component {
  handleChange(type) {
    this.props.fetchList({
      order: type
    }, true);
  }
  handleLoad() {
    return this.props.loadListMore()
    .then(action => {
      if (!action) return;
      if (action.error) throw action;
      return action;
    });
  }
  render() {
    const { entry: { list }, entities } = this.props;
    const entries = list.ids.map(id => entities.entries[id]);
    const renderList = entries.map((entry, key) => {
      return (
        <EntryMiniCard key={key} entry={entry} />
      );
    });
    return (
      <div className='small-content container'>
        <Helmet meta={[
          {
            name: 'robots',
            content: 'noindex, follow'
          }
        ]} />
        <SortOrderSelect list={list} onChange={this.handleChange.bind(this)}/>
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
        </InfiniteScroll>
      </div>
    );
  }
}

Index.propTypes = {
  entry: PropTypes.object,
  entities: PropTypes.object,
  fetchList: PropTypes.func.isRequired,
  loadListMore: PropTypes.func.isRequired
};

export const ConnectIndex = connect(
  store => ({
    entry: store.entry,
    entities: store.entities
  }),
  { fetchList, loadListMore }
)(Index);

ConnectIndex.fetchData = function(store) {
  return store.dispatch(loadList());
};

export default ConnectIndex;
