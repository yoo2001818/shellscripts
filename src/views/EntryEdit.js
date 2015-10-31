import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import translate from '../lang/index.js';
import EntryCreateForm from '../components/forms/EntryCreateForm.js';

class EntryEdit extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    const { author, entry } = this.props;
    return (
      <div id='entry-edit'>
        <Helmet title={__('editEntryTitle')} />
        <EntryCreateForm author={author}
          entry={entry}
          initialValues={entry} modifying
          formKey={entry.id} />
      </div>
    );
  }
}

EntryEdit.propTypes = {
  author: PropTypes.object,
  entry: PropTypes.object,
  lang: PropTypes.object
};

export default connect(
  (state, props) => {
    const { lang, entities: { users } } = state;
    const { entry } = props;
    const author = users[entry.author];
    return { author, lang };
  }
)(EntryEdit);
