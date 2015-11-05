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
import Helmet from 'react-helmet';

import translate from '../lang/index.js';
import { loadList } from '../actions/comment.js';
import { confirmEntryDelete } from '../actions/entry.js';
import { confirmEnable } from '../actions/listCart.js';
import Translated from '../components/ui/Translated.js';
import EntryMiniCard from '../components/EntryMiniCard.js';
import CommentList from '../components/CommentList.js';
import CommentForm from '../components/forms/CommentForm.js';
import LoadingOverlay from '../components/ui/LoadingOverlay.js';
import DropDownMenu from '../components/ui/DropDownMenu.js';
import netConfig from '../../config/network.config.js';

class EntryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutToEdit: false
    };
  }
  componentWillUpdate(props, state) {
    if (state.aboutToEdit) {
      const { entry, author, listCart } = props;
      if (entry.type === 'list') {
        const editLink = `/${author.username}/${entry.name}/edit`;
        if (listCart.target === editLink) {
          // OK, continue to that address. :P
          const { history } = this.context;
          history.pushState(null, editLink);
          this.setState({
            aboutToEdit: false
          });
        }
      }
    }
  }
  handleEdit(e) {
    const { entry, author, listCart } = this.props;
    if (entry.type === 'list') {
      // Check overwrite
      const editLink = `/${author.username}/${entry.name}/edit`;
      this.setState({
        aboutToEdit: true
      });
      if (listCart.target !== editLink) {
        this.props.confirmEnable(entry.childrenRaw, editLink);
        e.preventDefault();
      }
    }
  }
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
      __html: marked(entry.description || '', { sanitize: true })
    };
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { entry, author, session, sessionUser, entryLoading } = this.props;
    const rawPath =
      `${netConfig.url}/api/entries/${author.username}/${entry.name}/raw`;
    const editPath = `/${author.username}/${entry.name}/edit`;
    const title = `${entry.title} - ${author.name || author.username}`;
    const sudo = entry.requiresRoot ? 'sudo ' : '';
    if (entry.deleted) {
      const { history } = this.context;
      // Redirect to index?
      history.replaceState(null, '/');
      return false;
    }
    return (
      <div id='entry-view' className='entry-view'>
        <Helmet title={title} />
        <div className='header small-content'>
          <EntryMiniCard entry={entry} showFull={true}
            starable={!!session.login} />
          <div className='description'>
            <span dangerouslySetInnerHTML={this.getDescription()} />
          </div>
          { this.canEdit() ? (
            <div className='actions'>
              <Link to={editPath} onClick={this.handleEdit.bind(this)}>
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
                <i className='fa fa-trash' />
                <span className='description'>
                  <Translated name='delete' />
                </span>
              </button>
            </div>
          ) : false }
          <LoadingOverlay loading={entryLoading} />
        </div>
        { entry.type === 'script' ? (
          <div className='script-section'>
            <pre className='script'>
              <Highlight className='lang-bash' languages={['bash']}>
                {this.props.entry.script}
              </Highlight>
            </pre>
            { entry.requiresRoot ? (
              <div className='requires-root'>
                <Translated name='requiresRootDescription' />
              </div>
            ) : false }
          </div>
        ) : false }
        { entry.type === 'list' ? (
          <div className='list-section'>
            {
              entry.children.map((child, key) => (
                <EntryMiniCard entry={child} key={key} />
              ))
            }
          </div>
        ) : false }
        <div className='script-download'>
          <a href={rawPath}>
            <Translated name='downloadRaw' />
          </a>
          <DropDownMenu title={(
            <Translated name='scriptRunShortcut' />
          )} caption={__('scriptRunShortcutDesc')} href={rawPath} preventClose>
            <div className='script-shortcut'>
              <pre>
                <code>
                  {`curl -s ${rawPath} | ${sudo}bash /dev/stdin`}
                </code>
              </pre>
            </div>
          </DropDownMenu>
        </div>
        <CommentList entry={entry} />
        { this.canComment() ? (
          <CommentForm
            author={sessionUser}
            entry={entry}
            initialValues={{
              description: ''
            }}
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
  entryLoading: PropTypes.bool,
  lang: PropTypes.object,
  listCart: PropTypes.object,
  confirmEnable: PropTypes.func
};

EntryView.contextTypes = {
  history: PropTypes.any
};

const ConnectEntryView = connect(
  (state, props) => {
    const { session, entities: { users, entries }, lang, listCart } = state;
    const { entry } = props;
    return {
      sessionUser: users[session.login],
      session,
      author: users[entry.author],
      entryLoading: state.entry.load.loading,
      entry: Object.assign({}, entry, {
        children: entry.children && entry.children.map(id => entries[id]),
        childrenRaw: entry.children
      }),
      lang,
      listCart
    };
  },
  { confirmEntryDelete, confirmEnable }
)(EntryView);

ConnectEntryView.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(loadList({
    author: params.username,
    name: params.entryname
  }));
};

export default ConnectEntryView;
