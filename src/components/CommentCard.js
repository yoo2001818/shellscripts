import './style/CommentCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Translated from './ui/Translated.js';
import UserMiniCard from './UserMiniCard.js';

class CommentCard extends Component {
  render() {
    const { comment } = this.props;
    return (
      <div className='comment-card'>
        <div className='actions'>
          <button>
            <i className='fa fa-pencil' />
            <span className='description'>
              <Translated name='edit' />
            </span>
          </button>
          <button className='red-button'>
            <i className='fa fa-times' />
            <span className='description'>
              <Translated name='delete' />
            </span>
          </button>
        </div>
        <div className='container'>
          <UserMiniCard user={comment.author} />
          <div className='description'>
            {comment.description}
          </div>
        </div>
      </div>
    );
  }
}

CommentCard.propTypes = {
  comment: PropTypes.object
};

export default connect(
  (state, props) => {
    const { comment } = props;
    const { entities: { users } } = state;
    return {
      comment: Object.assign({}, comment, {
        author: users[comment.author]
      })
    };
  }
)(CommentCard);
