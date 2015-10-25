import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Translated from '../ui/Translated.js';
import ErrorShow from '../ui/ErrorShow.js';
import AutoExpandTextArea from 'react-textarea-autosize';
import UserMiniCard from '../UserMiniCard.js';
import translate from '../../lang/index.js';
import { create, edit, loadListMore } from '../../actions/comment.js';

class CommentForm extends Component {
  handleSubmit(data) {
    let promise;
    if (this.props.editing) {
      promise = this.props.dispatch(edit(this.props.entry,
        Object.assign({}, data, {
          id: this.props.editing
        })));
    } else {
      promise = this.props.dispatch(create(this.props.entry, data))
      .then(action => {
        if (action.error) return;
        this.props.dispatch(loadListMore(this.props.entry));
      });
    }
    promise.then(() => {
      if (this.props.onComplete) this.props.onComplete();
    });
  }
  handleCancel(e) {
    e.preventDefault();
    if (this.props.onComplete) this.props.onComplete();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { description }, handleSubmit,
      author, editing } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className='comment-card editing'>
          <div className='actions'>
            <button>
              <i className='fa fa-check' />
              <span className='description'>
                <Translated name={editing ? 'edit' : 'post'} />
              </span>
            </button>
            { editing ? (
              <button className='red-button'
                onClick={this.handleCancel.bind(this)}
              >
                <i className='fa fa-times' />
                <span className='description'>
                  <Translated name='cancel' />
                </span>
              </button>
            ) : false }
          </div>
          <div className='container'>
            <UserMiniCard user={author} />
            <div className='description'>
              <ErrorShow placeholder={__('subject')} noSuccess
                {...description}>
                <AutoExpandTextArea placeholder={__('subject')}
                  className='noresize' noNewLine {...description} />
              </ErrorShow>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

CommentForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  author: PropTypes.object,
  entry: PropTypes.object,
  editing: PropTypes.number,
  onComplete: PropTypes.func
};

function validateFrom(data) {
  const errors = {};
  if (!data.description) {
    errors.description = true;
  }
  return errors;
}

export default connect(
  store => ({form: store.form, lang: store.lang})
)(reduxForm({
  form: 'commentForm',
  fields: ['description'],
  validate: validateFrom
})(CommentForm));
