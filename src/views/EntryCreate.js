import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class EntryCreate extends Component {
  render() {
    const { username } = this.props;
    return (
      <div id='entry-create'>
        <EntryCreateForm
          initialValues={{ username }}/>
      </div>
    );
  }
}

EntryCreate.propTypes = {
  username: PropTypes.string
};

export default connect(
  store => ({
    username: store.session.login
  })
)(EntryCreate);
