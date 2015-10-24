import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadListMore } from '../actions/comment.js';
import InfiniteScroll from '../components/ui/InfiniteScroll.js';
import Translated from '../components/ui/Translated.js';
import CommentCard from './CommentCard.js';

// Calling comment list initially should be done in upper class, since this
// can't accept 'fetchData'.
class CommentList extends Component {
  handleLoad() {
    return this.props.loadListMore(this.props.entry)
    .then(action => {
      if (!action) return;
      if (action.error) throw action;
      return action;
    });
  }
  render() {
    const { list, comments } = this.props;
    if (list == null) return false;
    const entries = list.ids.map(id => comments[id]);
    const renderList = entries.map((entry, key) => {
      return (
        <CommentCard key={key} comment={entry} />
      );
    });
    return (
      <div>
        <InfiniteScroll
          loadMore={this.handleLoad.bind(this)}
          hasMore={!list.finished}
          loader={(
            <div className='loading content'>
              <i className="fa fa-refresh fa-spin"></i>
            </div>
          )}
          errorRetry={(
            <button onClick={this.handleLoad.bind(this)}>
              <Translated name='retry' />
            </button>
          )}
        >
          {renderList}
        </InfiniteScroll>
      </div>
    );
  }
}

CommentList.propTypes = {
  list: PropTypes.object,
  comments: PropTypes.object,
  entry: PropTypes.object,
  loadListMore: PropTypes.func
};

export default connect(
  (state, props) => {
    // Merge comment list then we're good
    const { comment, entities: { comments } } = state;
    const { entry } = props;
    const entryId = `${entry.author.toLowerCase()}/${entry.name}`;
    return {
      list: comment.list[entryId],
      comments
    };
  },
  { loadListMore }
)(CommentList);
