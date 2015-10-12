import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { loadList } from '../actions/entry.js';
import { connect } from 'react-redux';
import Translated from '../components/Translated.js';
import UserMiniCard from '../components/UserMiniCard.js';

class Index extends Component {
  render() {
    const { entry: { list }, entities } = this.props;
    const entries = list.map(id => entities.entries[id]);
    const renderList = entries.map((entry, key) => {
      const user = entities.users[entry.author];
      return (
        <div className='article' key={key}>
          <Link to={`/${user.login}/${entry.name}`}>
            <h1>{entry.title}</h1>
          </Link>
          <h2>{entry.name}</h2>
          <UserMiniCard user={user} />
          <p>
            {entry.brief}
          </p>
          <ul>
            {
              entry.tags.map(id => entities.tags[id])
              .map((tag, key) => (
                <li key={key}>
                  {tag.name} - {tag.description}
                </li>
              ))
            }
          </ul>
        </div>
      )
    })
    return (
      <div>
        <h1>
          <Translated name='hello'>{'World'}</Translated>
        </h1>
        {renderList}
      </div>
    );
  }
}

Index.propTypes = {
  entry: PropTypes.object,
  entities: PropTypes.object
};

export const ConnectIndex = connect(
  store => ({
    entry: store.entry,
    entities: store.entities
  })
)(Index);

ConnectIndex.fetchData = function(store) {
  return store.dispatch(loadList());
};

export default ConnectIndex;
