import './style/EntryMiniCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { star, unstar } from '../actions/entry.js';

import UserMiniCard from './UserMiniCard.js';
import ToolTip from './ui/ToolTip.js';
import Translated from './ui/Translated.js';
import sliceEllipsis from '../utils/sliceEllipsis.js';

class EntryMiniCard extends Component {
  handleToggleStar() {
    const { entry, star, unstar } = this.props;
    const { author } = entry;
    if (entry.voted) {
      return unstar(author.username, entry.name);
    }
    return star(author.username, entry.name);
  }
  render() {
    const { entry, hideUser, showFull, starable } = this.props;
    const { author, tags } = entry;
    const permalink = `${author.username}/${entry.name}`;
    if (entry.deleted) return false;
    return (
      <div className='entry-mini-card'>
        <div className='head'>
          {starable ? (
            <div className='status'>
              <button className='action'
                onClick={this.handleToggleStar.bind(this)}
              >
                <i className='fa fa-star' />
                <Translated name={entry.voted ? 'unstar' : 'star'} />
              </button>
              <div className='state'>
                {entry.stars}
              </div>
            </div>
          ) : (
            <div className='status'>
              <i className='fa fa-star' />
              {entry.stars}
            </div>
          )}
          { !hideUser ? (
            <div className='author'>
              <UserMiniCard user={author} hideUsername={true} />
            </div>
          ) : false }
          <h1 className='title'>
            <Link to={'/' + permalink}>
              {entry.title}
            </Link>
          </h1>
        </div>
        <p className='brief'>
          {showFull ? entry.brief : sliceEllipsis(entry.brief, 140)}
        </p>
        <ul className='tags'>
          {
            tags.map((tag, id) => (
              <li key={id}>
                <Link to='/search' query={{query: tag.name}}>
                  <ToolTip caption={tag.description}>
                    {tag.name}
                  </ToolTip>
                </Link>
              </li>
            ))
          }
        </ul>
        <div className='footer'>
          <span className='date'>
            {moment(entry.createdAt).fromNow()}
          </span>
          <span className='permalink'>
            <Link to={'/' + permalink}>
              {permalink}
            </Link>
          </span>
        </div>
      </div>
    );
  }
}

EntryMiniCard.propTypes = {
  entry: PropTypes.object.isRequired,
  showLink: PropTypes.bool,
  hideUser: PropTypes.bool,
  showFull: PropTypes.bool,
  starable: PropTypes.bool,
  star: PropTypes.func,
  unstar: PropTypes.func
};

export default connect(
  (state, props) => {
    const { entry } = props;
    const { entities: { users, tags } } = state;
    return {
      entry: Object.assign({}, entry, {
        author: users[entry.author],
        tags: entry.tags.map(id => tags[id])
      })
    };
  },
  { star, unstar }
)(EntryMiniCard);
