import './style/CommentCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { confirmCommentDelete, loadList } from '../actions/comment.js';
import Translated from './ui/Translated.js';
import UserMiniCard from './UserMiniCard.js';
import CommentForm from './forms/CommentForm.js';

class CommentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }
  handleComplete() {
    this.setState({
      editing: false
    });
  }
  handleEdit() {
    this.setState({
      editing: true
    });
  }
  handleDelete(e) {
    this.props.confirmCommentDelete(this.props.entry, this.props.comment.id);
    e.preventDefault();
  }
  canEdit() {
    const { author, session, sessionUser } = this.props;
    if (sessionUser == null) return;
    return session.login === author.login ||
      (sessionUser && sessionUser.isAdmin);
  }
  render() {
    const { author, comment, entry } = this.props;
    // Just hide the deleted comment
    if (comment.deleted) {
      return false;
    }
    if (this.state.editing) {
      return (
        <CommentForm
          key={comment.id}
          formKey={String(comment.id)}
          initialValues={comment}
          author={author}
          entry={entry}
          editing={comment.id}
          onComplete={this.handleComplete.bind(this)}
        />
      );
    }
    return (
      <div className='comment-card'>
        { this.canEdit() ? (
          <div className='actions'>
            <button onClick={this.handleEdit.bind(this)}>
              <i className='fa fa-pencil' />
              <span className='description'>
                <Translated name='edit' />
              </span>
            </button>
            <button className='red-button'
              onClick={this.handleDelete.bind(this)}
            >
              <i className='fa fa-times' />
              <span className='description'>
                <Translated name='delete' />
              </span>
            </button>
          </div>
        ) : false }
        <div className='container'>
          <UserMiniCard user={author} />
          <div className='date'>
            {moment(comment.createdAt).fromNow()}
          </div>
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
  entry: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object,
  confirmCommentDelete: PropTypes.func,
  loadList: PropTypes.func
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
  }, { confirmCommentDelete, loadList }
)(CommentCard);
