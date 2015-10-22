import './style/User.scss';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';
import { load } from '../actions/entry.js';
import NotFound from './NotFound.js';

class Entry extends Component {
  render() {
    const { params: { username, entryname }, entries } = this.props;
    const entry = entries[username.toLowerCase() + '/' +
      entryname.toLowerCase()];
    // Wait until fully loaded
    if (entry && entry.description !== undefined) {
      // Inject entry
      return cloneElement(this.props.children, { entry });
    } else if (entry === null) {
      // Display 404 if we can't find one
      return <NotFound />;
    } else {
      // Loading! :P
      return (
        <div id='entry'>
          <div className='loading content'>
            <i className="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      );
    }
  }
}

Entry.propTypes = {
  params: PropTypes.object,
  entries: PropTypes.object,
  children: PropTypes.object
};

const ConnectEntry = connect(
  store => ({entries: store.entities.entries}),
  { load }
)(Entry);

ConnectEntry.fetchData = function(store, routerState) {
  const { params } = routerState;
  return store.dispatch(load(params.username, params.entryname));
};

export default ConnectEntry;
