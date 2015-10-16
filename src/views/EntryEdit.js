import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class EntryEdit extends Component {
  render() {
    const { author, entry } = this.props;
    return (
      <div id='entry-edit'>
        <EntryCreateForm author={author} initialValues={entry} modifying />
      </div>
    );
  }
}

EntryEdit.propTypes = {
  author: PropTypes.object,
  entry: PropTypes.object
};

export default connect(
  (state, props) => {
    const { entities: { users } } = state;
    const { entry } = props;
    const author = users[entry.author];
    return { author };
  }
)(EntryEdit);
