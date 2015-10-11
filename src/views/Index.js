import React, { Component } from 'react';
import { loadList } from '../actions/entry.js';
import { connect } from 'react-redux';
import Translated from '../components/Translated.js';

class Index extends Component {
  render() {
    return (
      <div>
        <h1>
          <Translated name='hello'>{'World'}</Translated>
        </h1>
      </div>
    );
  }
}

export const ConnectIndex = connect(
  store => ({
    entities: store.entities
  })
)(Index);

ConnectIndex.fetchData = function(store) {
  return store.dispatch(loadList());
};

export default ConnectIndex;
