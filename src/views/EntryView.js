import React, { Component, PropTypes } from 'react';

export default class EntryView extends Component {
  render() {
    return (
      <div>
        Hello, world!
        {this.props.entry.name}
      </div>
    );
  }
}

EntryView.propTypes = {
  entry: PropTypes.object
};
