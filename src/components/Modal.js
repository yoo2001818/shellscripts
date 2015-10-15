import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { answer } from '../actions/modal.js';
import Translated from './ui/Translated.js';
import translate from '../lang/index.js';
import DialogOverlay from './ui/DialogOverlay.js';

class Modal extends Component {
  handleDismiss(choice) {
    this.props.answer(choice);
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { modal: { open, title, body, choices } } = this.props;
    if (!open) return false;
    let translatedBody = body;
    if (body.translated) {
      translatedBody = __(body.translated, body.props);
    }
    return (
      <DialogOverlay title={__(title)}>
        <div>
          { translatedBody }
        </div>
        <div className='footer linear'>
          { choices.map((choice, key) => (
            <button onClick={this.handleDismiss.bind(this, key)}
              className={choice.type} key={key}
            >
              <Translated name={choice.name} />
            </button>
          ))}
        </div>
      </DialogOverlay>
    );
  }
}

Modal.propTypes = {
  lang: PropTypes.object,
  modal: PropTypes.object.isRequired,
  answer: PropTypes.func.isRequired
};

export default connect(
  (state) => ({modal: state.modal, lang: state.lang}),
  { answer }
)(Modal);
