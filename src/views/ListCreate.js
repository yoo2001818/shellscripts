import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import translate from '../lang/index.js';
import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class ListCreate extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    const { user } = this.props;
    // Do not reset form; It should be saved!
    return (
      <div id='entry-create'>
        <Helmet title={__('createEntryTitle')} />
        <EntryCreateForm author={user} initialValues={{
          type: 'list'
        }} formKey='list' />
      </div>
    );
  }
}

ListCreate.propTypes = {
  user: PropTypes.object,
  lang: PropTypes.object
};

export default connect(
  state => {
    const { session, lang, entities: { users } } = state;
    const user = users[session.login];
    return { user, lang };
  }
)(ListCreate);
