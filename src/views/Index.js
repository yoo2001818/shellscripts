import React, { Component, PropTypes } from 'react';
import { loadList } from '../actions/entry.js';
import { connect } from 'react-redux';
import Translated from '../components/ui/Translated.js';
import EntryMiniCard from '../components/EntryMiniCard.js';

class Index extends Component {
  render() {
    const { entry: { list }, entities } = this.props;
    const entries = list.map(id => entities.entries[id]);
    const renderList = entries.map((entry, key) => {
      return (
        <EntryMiniCard key={key} entry={entry} />
      )
    })
    return (
      <div className='small-content'>
        <h1>
          <Translated name='hello'>{'World'}</Translated>
        </h1>
        {renderList}
      </div>
    );
  }
}

Index.propTypes = {
  entry: PropTypes.object,
  entities: PropTypes.object
};

export const ConnectIndex = connect(
  store => ({
    entry: store.entry,
    entities: store.entities
  })
)(Index);

ConnectIndex.fetchData = function(store) {
  return store.dispatch(loadList());
};

export default ConnectIndex;
