import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isLength, matches } from 'validator';
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
            <ErrorInput placeholder={__('title')} noSuccess {...title} />
          </LabelInput>
          <LabelInput label={__('briefDescription')}>
            <ErrorInput placeholder={__('briefDescription')} noSuccess
              {...brief} />
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

// TODO I hope this validation is universal - so I don't have to write it twice.
function validateFrom(data) {
  const errors = {};
  if (!data.name) {
    errors.name = true;
  } else if (!matches(data.name, /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/)) {
    errors.name = {
      id: 'ENTRY_NAME_POLICY'
    };
  } else if (!isLength(data.name, 1, 48)) {
    errors.name = {
      id: 'FIELD_TOO_LONG'
    }
  }
  if (!data.title) {
    errors.title = true;
  } else if (!isLength(data.title, 0, 150)) {
    errors.title = {
      id: 'FIELD_TOO_LONG'
    }
  }
  if (!data.brief) {
    errors.brief = true;
  } else if (!isLength(data.brief, 0, 400)) {
    errors.brief = {
      id: 'FIELD_TOO_LONG'
    }
  }
  // TODO some kind of autocomplete or something for tags.
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
