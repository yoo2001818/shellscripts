import './style/CommentCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Translated from './ui/Translated.js';
import UserMiniCard from './UserMiniCard.js';

class CommentCard extends Component {
  canEdit() {
    const { author, session, sessionUser } = this.props;
    if (sessionUser == null) return;
    return session.login === author.login ||
      (sessionUser && sessionUser.isAdmin);
  }
  render() {
    const { author, comment } = this.props;
    return (
      <div className='comment-card'>
        { this.canEdit() ? (
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
        ) : false }
        <div className='container'>
          <UserMiniCard user={author} />
          <div className='description'>
            {comment.description}
          </div>
        </div>
      </div>
    );
  }
}

CommentCard.propTypes = {
  comment: PropTypes.object,
  author: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object
};

export default connect(
  (state, props) => {
    const { comment } = props;
    const { session, entities: { users } } = state;
    return {
      sessionUser: users[session.login],
      session,
      author: users[comment.author],
      comment: comment
    };
  }
)(CommentCard);
