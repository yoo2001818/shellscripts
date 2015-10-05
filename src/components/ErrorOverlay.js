import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { errorDismiss } from '../actions/load.js';
import Dialog from './Dialog.js';
import Alert from './Alert.js';
import Translated from './Translated.js';
import translate from '../lang/index.js';
import DialogOverlay from './DialogOverlay.js';

class ErrorOverlay extends Component {
  handleDismiss() {
    this.props.errorDismiss();
  }
  componentDidMount() {
    this.handleFocus();
  }
  componentDidUpdate() {
    this.handleFocus();
  }
  handleFocus() {
    const { load: { error } } = this.props;
    if (!error) return;
    this.refs.dismiss.getDOMNode().focus();
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { load: { error } } = this.props;
    if (!error) return false;
    let errorMsg = error.body;
    // Sometimes server returns JSON object as an error, so we'll have to
    // do this to display an error message. Otherwise, it'll just return
    // [Object object], which is pretty bad for debugging.
    // Or, we could use JSON.stringify? I think that's pretty bad though.
    if (error.body.message) {
      errorMsg = error.body.message;
    }
    return (
      <DialogOverlay title={__('error')}>
        <div>
          <Translated name='errorDesc' />
        </div>
        <Alert>{`${errorMsg} @ ${error.type}`}</Alert>
        <div className='footer'>
          <button onClick={this.handleDismiss.bind(this)}
          ref='dismiss'>
            <Translated name='dismiss' />
          </button>
        </div>
      </DialogOverlay>
    );
  }
}

ErrorOverlay.propTypes = {
  lang: PropTypes.object,
  load: PropTypes.object.isRequired,
  errorDismiss: PropTypes.func.isRequired
};

export default connect(
  (state) => ({load: state.load, lang: state.lang}),
  { errorDismiss }
)(ErrorOverlay);
