import './style/EntryView.scss';
import 'highlight.js/styles/solarized_light.css';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import marked from 'marked';
import Highlight from 'react-highlight';

import { confirmEntryDelete } from '../actions/entry.js';
import Translated from '../components/ui/Translated.js';
import EntryMiniCard from '../components/EntryMiniCard.js';

class EntryView extends Component {
  handleDelete(e) {
    this.props.confirmEntryDelete(this.props.entry);
    e.preventDefault();
  }
  canEdit() {
    const { author, session, sessionUser } = this.props;
    return session.login === author.login ||
      (sessionUser && sessionUser.isAdmin);
  }
  getDescription() {
    const { entry } = this.props;
    return {
      __html: marked(entry.description, { sanitize: true })
    };
  }
  render() {
    const { entry, author, session } = this.props;
    const editPath = `/${author.username}/${entry.name}/edit`;
    if (entry.deleted) {
      const { history } = this.context;
      // Redirect to index?
      history.replaceState(null, '/');
      return false;
    }
    return (
      <div id='entry-view' className='entry-view small-content'>
        <div className='header'>
          <EntryMiniCard entry={entry} showFull={true}
            starable={session.login} />
          <div className='description'>
            <span dangerouslySetInnerHTML={this.getDescription()} />
          </div>
          { this.canEdit() ? (
            <div className='actions'>
              <Link to={editPath}>
                <button>
                  <i className='fa fa-pencil' />
                  <span className='description'>
                    <Translated name='edit' />
                  </span>
                </button>
              </Link>
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
        </div>
        <pre className='script'>
          <Highlight className='language-bash'>
            {this.props.entry.script}
          </Highlight>
        </pre>
      </div>
    );
  }
}

EntryView.propTypes = {
  entry: PropTypes.object,
  author: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object,
  confirmEntryDelete : PropTypes.func
};

EntryView.contextTypes = {
  history: PropTypes.any
};

export default connect(
  (state, props) => {
    const { session, entities: { users } } = state;
    const { entry } = props;
    return {
      sessionUser: users[session.login],
      session,
      author: users[entry.author]
    };
  },
  { confirmEntryDelete }
)(EntryView);
