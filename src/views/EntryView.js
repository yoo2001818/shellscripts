import './style/EntryView.scss';

import React, { Component, PropTypes } from 'react';
import marked from 'marked';

import EntryMiniCard from '../components/EntryMiniCard.js';

export default class EntryView extends Component {
  getDescription() {
    const { entry } = this.props;
    return {
      __html: marked(entry.description, { sanitize: true })
    };
  }
  render() {
    const { entry } = this.props;
    return (
      <div id='entry-view' className='entry-view small-content'>
        <div className='header'>
          <EntryMiniCard entry={entry} showFull={true} />
          <div className='description'>
            <span dangerouslySetInnerHTML={this.getDescription()} />
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
