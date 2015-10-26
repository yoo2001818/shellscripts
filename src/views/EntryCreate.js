import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import translate from '../lang/index.js';
import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class EntryCreate extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    const { user } = this.props;
    return (
      <div id='entry-create'>
        <Helmet title={__('createEntryTitle')} />
        <EntryCreateForm author={user} initialValues={{
          // This is to avoid React bug #2533
          // https://github.com/facebook/react/issues/2533
          brief: '', description: '', script: '', author: user.username
        }}/>
      </div>
    );
  }
}

EntryCreate.propTypes = {
  user: PropTypes.object,
  lang: PropTypes.object
};

export default connect(
  state => {
    const { session, lang, entities: { users } } = state;
    const user = users[session.login];
    return { user, lang };
  }
)(EntryCreate);
