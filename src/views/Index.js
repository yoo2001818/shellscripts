import React, { Component, PropTypes } from 'react';
import { loadList, loadListMore } from '../actions/entry.js';
import { connect } from 'react-redux';
import Translated from '../components/ui/Translated.js';
import LoadingOverlay from '../components/ui/LoadingOverlay.js';
import EntryMiniCard from '../components/EntryMiniCard.js';
import Helmet from 'react-helmet';

class Index extends Component {
  handleLoad() {
    this.props.loadListMore();
  }
  render() {
    const { entry: { list }, entities } = this.props;
    const entries = list.ids.map(id => entities.entries[id]);
    const renderList = entries.map((entry, key) => {
      return (
        <EntryMiniCard key={key} entry={entry} />
      )
    })
    return (
      <div className='small-content container'>
        <Helmet meta={[
          {
            name: 'robots',
            content: 'noindex, follow'
          }
        ]} />
        <h1>
          <Translated name='hello'>{'World'}</Translated>
        </h1>
        {renderList}
        { list.lastIndex !== 1 ? (
          <button onClick={this.handleLoad.bind(this)}>Load More</button>
        ) : false }
        <LoadingOverlay loading={list.load.loading} />
      </div>
    );
  }
}

Index.propTypes = {
  entry: PropTypes.object,
  entities: PropTypes.object,
  loadListMore: PropTypes.func.isRequired
};

export const ConnectIndex = connect(
  store => ({
    entry: store.entry,
    entities: store.entities
  }),
  { loadListMore }
)(Index);

ConnectIndex.fetchData = function(store) {
  return store.dispatch(loadList());
};

export default ConnectIndex;
