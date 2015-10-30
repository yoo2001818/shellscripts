import './style/ListCart.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { add, remove } from '../actions/listCart.js';

import AddToListCart from './AddToListCart.js';
import UserMiniCard from './UserMiniCard.js';

// Really simplified version of EntryMiniCard
class RawEntryTinyCard extends Component {
  render() {
    const { entry } = this.props;
    const { author } = entry;
    const permalink = `${author.username}/${entry.name}`;
    return (
      <div className='entry-tiny-card'>
        <AddToListCart entry={entry} showRemoveIcon />
        <div className='author'>
          <UserMiniCard user={author} hideUsername={true} />
        </div>
        <h1 className='title'>
          <Link to={'/' + permalink}>
            { entry.type === 'list' ? (
              <i className='fa fa-list' />
            ) : (
              <i className='fa fa-file-o' />
            ) }
            {entry.title}
          </Link>
        </h1>
      </div>
    );
  }
}

RawEntryTinyCard.propTypes = {
  entry: PropTypes.object
};

const EntryTinyCard = connect(
  (state, props) => {
    const { entry } = props;
    const { entities: { users, tags } } = state;
    return {
      entry: Object.assign({}, entry, {
        author: users[entry.author],
        tags: entry.tags.map(id => tags[id])
      })
    };
  }
)(RawEntryTinyCard);

class ListCart extends Component {
  render() {
    const { listCart, entries } = this.props;
    if (!listCart.enabled) return false;
    const list = listCart.list.map(entry => entries[entry]);
    return (
      <div className='list-cart'>
        <div className='list'>
          {
            list.map((entry, key) => (
              <EntryTinyCard entry={entry} key={key} />
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
  entries: PropTypes.object
};

export default connect(
  store => ({
    listCart: store.listCart,
    entries: store.entities.entries
  }),
  { add, remove }
)(ListCart);
