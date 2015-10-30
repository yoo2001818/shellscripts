import './style/DragEntryTinyCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import { DragSource as dragSource, DropTarget as dropTarget } from 'react-dnd';

import AddToListCart from './AddToListCart.js';
import UserMiniCard from './UserMiniCard.js';

const CARD = 'LIST_CART_CARD';

const cardSource = {
  beginDrag(props) {
    return {
      entryId: props.entry.entryId,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    props.swap(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

// Really simplified version of EntryMiniCard
class RawEntryTinyCard extends Component {
  render() {
    const { entry, connectDragSource, connectDropTarget, isDragging }
      = this.props;
    const { author } = entry;
    const permalink = `${author.username}/${entry.name}`;
    return connectDragSource(connectDropTarget(
      <div className={classNames('entry-tiny-card', {
        dragging: isDragging
      })}>
        <AddToListCart entry={entry} showRemoveIcon ignoreDisabled />
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
    ));
  }
}

RawEntryTinyCard.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  entry: PropTypes.object
};

// I want to use ES7...
let EntryTinyCard = connect(
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

EntryTinyCard = dragSource(CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(EntryTinyCard);

EntryTinyCard = dropTarget(CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(EntryTinyCard);

export default EntryTinyCard;
