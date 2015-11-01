import './style/EntryMiniCard.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { star, unstar, report, reportReset } from '../actions/entry.js';

import UserMiniCard from './UserMiniCard.js';
import AddToListCart from './AddToListCart.js';
import DropDownMenu from './ui/DropDownMenu.js';
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
  handleReport() {
    const { entry, report } = this.props;
    const { author } = entry;
    return report(author.username, entry.name);
  }
  handleReportReset() {
    const { entry, reportReset } = this.props;
    const { author } = entry;
    return reportReset(author.username, entry.name);
  }
  shouldComponentUpdate(nextProps) {
    const { rawEntry } = nextProps;
    const entry = rawEntry;
    for (var key in entry) {
      if (Array.isArray(this.cache[key])) {
        if (this.cache[key].length !== entry[key].length) return true;
      } else {
        if (this.cache[key] !== entry[key]) return true;
      }
    }
    return false;
  }
  render() {
    const { rawEntry, entry, hideUser, showFull, starable, user } = this.props;
    this.cache = Object.assign({}, rawEntry);
    const { author, tags } = entry;
    const permalink = `${author.username}/${entry.name}`;
    if (entry.deleted) return false;
    return (
      <div className='entry-mini-card'>
        <div className='head'>
            <div className='status'>
              { user && user.isAdmin ? (
                <span className='reports raw'>
                  <i className='fa fa-flag' />
                  {entry.reports}
                </span>
              ) : false }
              {starable ? (
                <span className='stars'>
                  <button className='action'
                    onClick={this.handleToggleStar.bind(this)}
                  >
                    <i className='fa fa-star' />
                    <Translated name={entry.voted ? 'unstar' : 'star'} />
                  </button>
                  <div className='state'>
                    {entry.stars}
                  </div>
                </span>
              ) : (
                <span className='stars raw'>
                  <i className='fa fa-star' />
                  {entry.stars}
                </span>
              )}
              <AddToListCart entry={entry} />
              { showFull ? (
                <span className='more'>
                  <DropDownMenu title={null}>
                    <ul>
                      <li>
                        <a href='#' onClick={this.handleReport.bind(this)}>
                          <Translated name={'report'} />
                        </a>
                      </li>
                      { user && user.isAdmin ? (
                        <li>
                          <a href='#'
                            onClick={this.handleReportReset.bind(this)}
                          >
                            <Translated name={'reportReset'} />
                          </a>
                        </li>
                      ) : false }
                    </ul>
                  </DropDownMenu>
                </span>
              ) : false }
          </div>
          { !hideUser ? (
            <div className='author'>
              <UserMiniCard user={author} hideUsername={true} />
            </div>
          ) : false }
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
            <ToolTip caption={moment(entry.createdAt).format('lll')}>
              {moment(entry.createdAt).fromNow()}
            </ToolTip>
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
  rawEntry: PropTypes.object,
  entry: PropTypes.object.isRequired,
  showLink: PropTypes.bool,
  hideUser: PropTypes.bool,
  showFull: PropTypes.bool,
  starable: PropTypes.bool,
  user: PropTypes.bool,
  star: PropTypes.func,
  unstar: PropTypes.func,
  report: PropTypes.func,
  reportReset: PropTypes.func
};

export default connect(
  (state, props) => {
    const { entry } = props;
    const { session, entities: { users, tags } } = state;
    return {
      entry: Object.assign({}, entry, {
        author: users[entry.author],
        tags: entry.tags.map(id => tags[id])
      }),
      rawEntry: entry,
      user: users[session.login]
    };
  },
  { star, unstar, report, reportReset }
)(EntryMiniCard);
