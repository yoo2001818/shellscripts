import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { fetchUserStarredList, loadUserStarredList, loadUserStarredListMore }
  from '../../actions/entry.js';
import Translated from '../../components/ui/Translated.js';
import InfiniteScroll from '../../components/ui/InfiniteScroll.js';
import EntryMiniCard from '../../components/EntryMiniCard.js';
import SortOrderSelect from '../../components/SortOrderSelect.js';
import UserProfile from './UserProfile.js';

class UserStarred extends Component {
  constructor(props) {
    super(props);
  }
  handleChange(type) {
    this.props.fetchUserStarredList(this.props.user.username, {
      order: type
    }, true);
  }
  handleLoadList() {
    return this.props.loadUserStarredListMore(this.props.user.username)
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
          <EntryMiniCard key={key} entry={entry} />
        );
      })) || [];
    let docTitle = user.username;
    if (user.name) docTitle = `${user.name} (${user.username})`;
    return (
      <div id='user-entries'>
        <Helmet title={docTitle} />
        <UserProfile user={user} selected='starred' />
        <div className='small-content'>
          <SortOrderSelect list={list} onChange={this.handleChange.bind(this)}/>
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

UserStarred.propTypes = {
  user: PropTypes.object,
  entries: PropTypes.object,
  list: PropTypes.object,
  fetchUserStarredList: PropTypes.func.isRequired,
  loadUserStarredListMore: PropTypes.func.isRequired
};

const ConnectUserStarred = connect(
  (state, props) => {
    const { entry, entities: { entries } } = state;
    const { user } = props;
    return {
      list: entry.userStarredList[user.login], entries
    };
  },
  { fetchUserStarredList, loadUserStarredListMore }
)(UserStarred);

ConnectUserStarred.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(loadUserStarredList(params.username));
};

export default ConnectUserStarred;
