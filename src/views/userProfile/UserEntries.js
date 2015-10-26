import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { loadUserList, loadUserListMore } from '../../actions/entry.js';
import Translated from '../../components/ui/Translated.js';
import InfiniteScroll from '../../components/ui/InfiniteScroll.js';
import EntryMiniCard from '../../components/EntryMiniCard.js';
import UserProfile from './UserProfile.js';

class UserEntries extends Component {
  constructor(props) {
    super(props);
  }
  handleLoadList() {
    return this.props.loadUserListMore(this.props.user.username)
    .then(action => {
      if (!action) return;
      if (action.error) throw action;
      return action;
    });
  }
  render() {
    const { user, list, entries } = this.props;
    const renderList = (list && list.ids &&
      list.ids.map(id => entries[id]).map((entry, key) => {
        return (
          <EntryMiniCard key={key} entry={entry} hideUser={true} />
        );
      })) || [];
    let docTitle = user.username;
    if (user.name) docTitle = `${user.name} (${user.username})`;
    return (
      <div id='user-entries'>
        <Helmet title={docTitle} />
        <UserProfile user={user} selected='entries' />
        <div className='small-content'>
          <InfiniteScroll
            loadMore={this.handleLoadList.bind(this)}
            hasMore={list && !list.finished}
            loader={(
              <div className='loading content'>
                <i className="fa fa-refresh fa-spin"></i>
              </div>
            )}
            errorRetry={(
              <button onClick={this.handleLoadList.bind(this)}>
                <Translated name='retry' />
              </button>
            )}
          >
            { renderList }
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

UserEntries.propTypes = {
  user: PropTypes.object,
  entries: PropTypes.object,
  list: PropTypes.object,
  loadUserListMore: PropTypes.func.isRequired
};

const ConnectUserEntries = connect(
  (state, props) => {
    const { entry, entities: { entries } } = state;
    const { user } = props;
    return {
      list: entry.userList[user.login], entries
    };
  },
  { loadUserListMore }
)(UserEntries);

ConnectUserEntries.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(loadUserList(params.username));
};

export default ConnectUserEntries;
