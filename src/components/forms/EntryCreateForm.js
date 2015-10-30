import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { isLength, matches } from 'validator';
import { create, edit, load } from '../../actions/entry.js';
import { disable, enable } from '../../actions/listCart.js';

import Translated from '../ui/Translated.js';
import translate from '../../lang/index.js';
import InputTip from '../ui/InputTip.js';
import LabelInput from '../ui/LabelInput.js';
import ErrorInput from '../ui/ErrorInput.js';
import ErrorShow from '../ui/ErrorShow.js';
import LoadingOverlay from '../ui/LoadingOverlay.js';
import TagSelect from '../TagSelect.js';
import AutoExpandTextArea from 'react-textarea-autosize';
import UserMiniCard from '../UserMiniCard.js';
import ListCart from '../ListCart.js';

// Ever heard of universal React? :(
let AceEditor;
if (__CLIENT__) {
  // Conditional import isn't possible with import keyword, so we're using
  // require function.
  AceEditor = require('react-ace');
  require('brace/mode/sh');
  require('brace/mode/markdown');
  require('brace/theme/solarized_light');
} else {
  // Server fallback.
  AceEditor = class AceEditor extends Component {
    render() {
      return (
        <textarea {...this.props} />
      );
    }
  };
}

class EntryCreateForm extends Component {
  handleSubmit(data) {
    let doAction = create;
    if (this.props.modifying) doAction = edit;
    this.props.dispatch(doAction(Object.assign({}, data, {
      children: this.props.listCart.list
    })))
    .then(action => {
      if (!action.payload.result) return;
      const { history } = this.context;
      // Redirect to created entry. :/
      history.pushState(null, '/' + action.payload.result);
    });
    this.props.dispatch(disable());
  }
  componentWillMount() {
    // Here, we overwrite cart data if children are available.
    const { entry, author, listCart } = this.props;
    if (entry && entry.type === 'list') {
      const editLink = `/${author.username}/${entry.name}/edit`;
      if (listCart.target !== editLink) {
        this.props.dispatch(enable(entry.children, editLink));
      }
    }
  }
  componentDidUpdate() {
    const { entry, author, listCart } = this.props;
    if (entry && entry.type === 'list') {
      const editLink = `/${author.username}/${entry.name}/edit`;
      if (!listCart.enabled || listCart.target !== editLink) {
        // You don't belong here!
        const { history } = this.context;
        // Redirect back. woot
        history.goBack();
      }
    }
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { fields: { name, title, brief, description, tags, script, type },
      handleSubmit, invalid, author, modifying, entryLoading } = this.props;
    const permalink = `${author.username}/${name.value}`;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit.bind(this))}>
        <div
          className='entry-create-form form entry-view container'
        >
          <div className='header small-content'>
            <div className='entry-mini-card'>
              <div className='head tabular'>
                <div className='author'>
                  <UserMiniCard user={author} hideUsername hideName />
                </div>
                <h1 className='title'>
                  <ErrorInput placeholder={__('title')} noSuccess {...title} />
                </h1>
              </div>
              <div className='brief'>
                <ErrorShow placeholder={__('briefDescription')} noSuccess
                  {...brief}>
                  <AutoExpandTextArea placeholder={__('briefDescription')}
                    className='dotted noresize' noNewLine {...brief} />
                </ErrorShow>
              </div>
              <ul className='tags'>
                <TagSelect placeholder={__('tags')}
                  className='dotted' {...tags} />
              </ul>
              <div className='footer'>
                { modifying ? (
                  permalink
                ) : (
                  <ErrorInput placeholder={__('link')}
                    {...name} className='right dotted' />
                )}
              </div>
            </div>
            <div className='description'>
              <LabelInput label={__('description')}>
                <AceEditor
                   mode='markdown'
                   theme='solarized_light'
                   height='30em'
                   width='100%'
                   fontSize={16}
                   {...description}
                   />
                <InputTip>
                  <Translated name='acceptsMarkdown' />
                </InputTip>
              </LabelInput>
            </div>
          </div>
          { type.value === 'script' ? (
            <LabelInput label={__('script')}>
              <div className='script'>
                <AceEditor
                  mode='sh'
                  theme='solarized_light'
                  height='40em'
                  width='100%'
                  fontSize={16}
                  {...script}
                  />
              </div>
            </LabelInput>
          ) : false }
          { type.value === 'list' ? (
            <div>
              <ListCart editor />
            </div>
          ) : false }
          { type.value === 'list' ? (
            <div className='footer'>
              <button disabled={invalid}>
                <Translated name='save' />
              </button>
            </div>
          ) : (
            <div className='footer'>
              <button disabled={invalid}>
                <Translated name='save' />
              </button>
            </div>
          )}
          <LoadingOverlay loading={entryLoading} />
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
  invalid: PropTypes.bool,
  author: PropTypes.object,
  modifying: PropTypes.bool,
  entryLoading: PropTypes.bool,
  type: PropTypes.string,
  listCart: PropTypes.object,
  entry: PropTypes.object
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
    };
  }
  if (!data.title) {
    errors.title = true;
  } else if (!isLength(data.title, 0, 150)) {
    errors.title = {
      id: 'FIELD_TOO_LONG'
    };
  }
  if (!data.brief) {
    errors.brief = true;
  } else if (!isLength(data.brief, 0, 400)) {
    errors.brief = {
      id: 'FIELD_TOO_LONG'
    };
  }
  // TODO some kind of autocomplete or something for tags.
  /* errors.name = {
    id: 'ENTRY_NAME_POLICY'
  }; */
  return errors;
}

function asyncValidateForm(data, dispatch) {
  console.log(data);
  if (data.id == null) {
    // Check if name exists.
    return dispatch((dispatch, getState) => {
      const { session } = getState();
      // WTF
      if (session == null) return Promise.resolve({});
      const { login } = session;
      // Then, fetch the name.
      return dispatch(load(login, data.name, true))
      .then(action => {
        if (action && action.error) {
          return {};
        } else {
          return {
            name: {
              id: 'ENTRY_NAME_EXISTS'
            }
          };
        }
      });
    });
  }
  return Promise.resolve({});
}

export default connect(
  store => ({
    form: store.form,
    lang: store.lang,
    entryLoading: store.entry.load && store.entry.load.loading,
    listCart: store.listCart
  })
)(reduxForm({
  form: 'entryCreate',
  fields: ['name', 'author', 'title', 'brief', 'description', 'tags',
    'script', 'requiresRoot', 'type', 'id'],
  validate: validateFrom,
  asyncValidate: asyncValidateForm,
  asyncBlurFields: ['name']
})(EntryCreateForm));
