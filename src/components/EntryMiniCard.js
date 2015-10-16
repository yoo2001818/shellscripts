import './style/EntryMiniCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import UserMiniCard from './UserMiniCard.js';
import ToolTip from './ui/ToolTip.js';
import sliceEllipsis from '../utils/sliceEllipsis.js';

class EntryMiniCard extends Component {
  render() {
    const { entry, hideUser, showFull } = this.props;
    const { author, tags } = entry;
    const permalink = `${author.username}/${entry.name}`;
    return (
      <div className='entry-mini-card'>
        <div className='head'>
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
                <ToolTip caption={tag.description}>
                  {tag.name}
                </ToolTip>
              </li>
            ))
          }
        </ul>
        <div className='permalink'>
          <Link to={'/' + permalink}>
            {permalink}
          </Link>
        </div>
      </div>
    );
  }
}

EntryMiniCard.propTypes = {
  entry: PropTypes.object.isRequired,
  showLink: PropTypes.bool,
  hideUser: PropTypes.bool,
  showFull: PropTypes.bool
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
  }
)(EntryMiniCard);
