import './style/EntryView.scss';
import 'highlight.js/styles/solarized_light.css';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import marked from 'marked';
import highlight from 'highlight.js';

marked.setOptions({
  highlight: function (code, lang) {
    if (lang != null && highlight.getLanguage(lang)) {
      return highlight.highlight(lang, code, false).value;
    }
    return highlight.highlightAuto(code).value;
  }
});

import Highlight from 'react-highlight';

import { loadList } from '../actions/comment.js';
import { confirmEntryDelete } from '../actions/entry.js';
import Translated from '../components/ui/Translated.js';
import EntryMiniCard from '../components/EntryMiniCard.js';
import CommentList from '../components/CommentList.js';
import CommentForm from '../components/forms/CommentForm.js';
import LoadingOverlay from '../components/ui/LoadingOverlay.js';

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
  canComment() {
    const { session } = this.props;
    return !!session.login;
  }
  getDescription() {
    const { entry } = this.props;
    return {
      __html: marked(entry.description, { sanitize: true })
    };
  }
  render() {
    const { entry, author, session, sessionUser, entryLoading } = this.props;
    const editPath = `/${author.username}/${entry.name}/edit`;
    if (entry.deleted) {
      const { history } = this.context;
      // Redirect to index?
      history.replaceState(null, '/');
      return false;
    }
    return (
      <div id='entry-view' className='entry-view'>
        <div className='header small-content'>
          <EntryMiniCard entry={entry} showFull={true}
            starable={!!session.login} />
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
          <LoadingOverlay loading={entryLoading} />
        </div>
        <pre className='script'>
          <Highlight className='lang-bash' languages={['bash']}>
            {this.props.entry.script}
          </Highlight>
        </pre>
        <CommentList entry={entry} />
        { this.canComment() ? (
          <CommentForm
            author={sessionUser}
            entry={entry}
          />
        ) : false }
      </div>
    );
  }
}

EntryView.propTypes = {
  entry: PropTypes.object,
  author: PropTypes.object,
  session: PropTypes.object,
  sessionUser: PropTypes.object,
  confirmEntryDelete: PropTypes.func,
  entryLoading: PropTypes.bool
};

EntryView.contextTypes = {
  history: PropTypes.any
};

const ConnectEntryView = connect(
  (state, props) => {
    const { session, entities: { users } } = state;
    const { entry } = props;
    return {
      sessionUser: users[session.login],
      session,
      author: users[entry.author],
      entryLoading: state.entry.load.loading
    };
  },
  { confirmEntryDelete }
)(EntryView);

ConnectEntryView.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(loadList({
    author: params.username,
    name: params.entryname
  }));
};

export default ConnectEntryView;
