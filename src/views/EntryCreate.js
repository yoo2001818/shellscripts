import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class EntryCreate extends Component {
  render() {
    const { user } = this.props;
    return (
      <div id='entry-create'>
        <EntryCreateForm author={user} initialValues={{
          // This is to avoid React bug #2533
          // https://github.com/facebook/react/issues/2533
          brief: '', description: '', script: ''
        }}/>
      </div>
    );
  }
}

EntryCreate.propTypes = {
  user: PropTypes.object
};

export default connect(
  state => {
    const { session, entities: { users } } = state;
    const user = users[session.login];
    return { user };
  }
)(EntryCreate);
