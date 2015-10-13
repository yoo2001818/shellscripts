import './style/EntryView.scss';

import React, { Component, PropTypes } from 'react';

import EntryMiniCard from '../components/EntryMiniCard.js';

export default class EntryView extends Component {
  render() {
    const { entry } = this.props;
    return (
      <div id='entry-view'>
        <div className='header'>
          <EntryMiniCard entry={entry} />
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
  entry: PropTypes.object
};
