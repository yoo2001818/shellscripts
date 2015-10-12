import './style/EntryView.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import UserMiniCard from '../components/UserMiniCard.js';

export default class EntryView extends Component {
  render() {
    const { entry, users } = this.props;
    const user = users[entry.author];
    return (
      <div id='entry-view'>
        <div className='header'>
          <div className='info'>
            <h1 className='title'>
              {entry.title}
            </h1>
            <div className='permalink'>
              {`${user.username}/${entry.name}`}
            </div>
            <div className='author'>
              <UserMiniCard user={user} hideUsername={true} />
            </div>
            <p className='brief'>{entry.brief}</p>
          </div>
          <div className='description'>
            <p>{entry.description}</p>
          </div>
        </div>
        <pre className='script'>
          <code>
            {this.props.entry.script}
          </code>
        </pre>
      </div>
    );
  }
}

EntryView.propTypes = {
  entry: PropTypes.object,
  users: PropTypes.object
};

export default connect(
  store => ({
    users: store.entities.users
  })
)(EntryView);
