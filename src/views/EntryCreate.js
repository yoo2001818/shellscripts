import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class EntryCreate extends Component {
  render() {
    const { user } = this.props;
    return (
      <div id='entry-create'>
        <EntryCreateForm author={user}
          initialValues={{ username: user.username }}/>
      </div>
    );
  }
}

EntryCreate.propTypes = {
  user: PropTypes.object
};

export default connect(
  state => {
    const { session, entities: { users }, lang } = state;
    const user = users[session.login];
    return { user };
  }
)(EntryCreate);
