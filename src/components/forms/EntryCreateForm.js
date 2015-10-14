import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { create } from '../../actions/entry.js';

import Translated from '../ui/Translated.js';
import translate from '../../lang/index.js';
import InputTip from '../ui/InputTip.js';
import LabelInput from '../ui/LabelInput.js';
import ErrorInput from '../ui/ErrorInput.js';

// Ever heard of universal React? :(
let AceEditor;
if (__CLIENT__) {
  // Conditional import isn't possible with import keyword, so we're using
  // require function.
  AceEditor = require('react-ace');
  require('brace/mode/sh');
  require('brace/theme/solarized_light');
} else {
  // Server fallback.
  AceEditor = class AceEditor extends Component {
    render() {
      return (
        <textarea {...this.props} />
      );
    }
  }
}

class EntryCreateForm extends Component {
  handleSubmit(data) {
    console.log(data);
    this.props.dispatch(create(data))
    .then(action => {
      console.log(action);
      if (!action.payload.result) return;
      const { history } = this.context;
      // Redirect to created entry. :/
      history.pushState(null, '/' + action.payload.result);
    });
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { name, title, brief, description, tags, script },
      handleSubmit, invalid } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div className='entry-create-form small-content form'>
          <h1>
            <Translated name='newEntry' />
          </h1>
          <LabelInput label={__('name')}>
            <ErrorInput placeholder={__('name')} {...name} />
          </LabelInput>
          <LabelInput label={__('title')}>
            <input placeholder={__('title')} {...title} />
          </LabelInput>
          <LabelInput label={__('briefDescription')}>
            <input placeholder={__('briefDescription')} {...brief} />
          </LabelInput>
          <LabelInput label={__('tags')}>
            <ErrorInput placeholder={__('tags')} {...tags} />
            <InputTip>
              <Translated name='seperatedByComma' />
            </InputTip>
          </LabelInput>
          <LabelInput label={__('description')}>
            <textarea placeholder={__('description')} rows={10} className='code'
              {...description} />
            <InputTip>
              <Translated name='acceptsMarkdown' />
            </InputTip>
          </LabelInput>
          <LabelInput label={__('script')}>
            <AceEditor
               mode='sh'
               theme='solarized_light'
               height='15em'
               width='100%'
               fontSize={16}
               {...script}
               />
          </LabelInput>
          <div className='footer'>
            <button disabled={invalid}>
              <Translated name='save' />
            </button>
          </div>
        </div>
      </form>
    );
  }
}

EntryCreateForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  invalid: PropTypes.bool
};

EntryCreateForm.contextTypes = {
  history: PropTypes.any
};

function validateFrom() {
  const errors = {};
  /* errors.name = {
    id: 'ENTRY_NAME_POLICY'
  }; */
  return errors;
}

export default connect(
  store => ({form: store.form, lang: store.lang})
)(reduxForm({
  form: 'entryCreate',
  fields: ['name', 'username', 'title', 'brief', 'description', 'tags',
    'script', 'requiresRoot'],
  validate: validateFrom
})(EntryCreateForm));
