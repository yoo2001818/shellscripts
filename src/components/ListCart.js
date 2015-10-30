import './style/ListCart.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classNames from 'classnames';

import { add, remove, swap, confirmDisable } from '../actions/listCart.js';
import DragEntryTinyCard from './DragEntryTinyCard.js';
import Translated from './ui/Translated.js';

class ListCart extends Component {
  handleCancelList(e) {
    this.props.confirmDisable();
    e.preventDefault();
  }
  render() {
    const { listCart, entries, editor } = this.props;
    if (!listCart.enabled && !editor) return false;
    const list = listCart.list.map(entry => Object.assign({}, entries[entry], {
      entryId: entry
    }));
    return (
      <div className={classNames('list-cart', { editor })}>
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
          { list.length === 0 ? (
            <div className='tip'>
              <Translated name='listInsertTip' />
            </div>
          ) : false }
        </div>
        { !editor ? (
          <div className='actions'>
            <ul>
              { list.length > 0 ? (
                <li>
                  { listCart.target ? (
                    <Link to={listCart.target}>
                      <Translated name='listCartEdit' />
                    </Link>
                  ) : (
                    <Link to='/new/list'>
                      <Translated name='listCartWrite' />
                    </Link>
                  ) }
                </li>
              ) : false }
              <li>
                <Link to='/' onClick={this.handleCancelList.bind(this)}>
                  <Translated name='listCartCancel' />
                </Link>
              </li>
            </ul>
          </div>
        ) : false }
      </div>
    );
  }
}

ListCart.propTypes = {
  listCart: PropTypes.object,
  entries: PropTypes.object,
  swap: PropTypes.func,
  confirmDisable: PropTypes.func,
  editor: PropTypes.bool
};

export default dragDropContext(HTML5Backend)(connect(
  store => ({
    listCart: store.listCart,
    entries: store.entities.entries
  }),
  { add, remove, swap, confirmDisable }
)(ListCart));
