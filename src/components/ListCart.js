import './style/ListCart.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { add, remove, swap } from '../actions/listCart.js';
import DragEntryTinyCard from './DragEntryTinyCard.js';

class ListCart extends Component {
  render() {
    const { listCart, entries } = this.props;
    if (!listCart.enabled) return false;
    const list = listCart.list.map(entry => Object.assign({}, entries[entry], {
      entryId: entry
    }));
    return (
      <div className='list-cart'>
        <div className='list'>
          {
            list.map((entry, key) => (
              <DragEntryTinyCard
                entry={entry}
                key={entry.entryId}
                index={key}
                swap={this.props.swap} />
            ))
          }
        </div>
        <div className='actions'>
          <button>수정</button>
        </div>
      </div>
    );
  }
}

ListCart.propTypes = {
  listCart: PropTypes.object,
  entries: PropTypes.object,
  swap: PropTypes.func
};

export default dragDropContext(HTML5Backend)(connect(
  store => ({
    listCart: store.listCart,
    entries: store.entities.entries
  }),
  { add, remove, swap }
)(ListCart));
