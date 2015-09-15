import './style/ErrorOverlay.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { errorDismiss } from '../actions/load.js';
import Dialog from './Dialog.js';
import Alert from './Alert.js';
import Translated from './Translated.js';
import translate from '../lang/index.js';

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
    return (
      <div id='errorCover'>
        <div className='middle'>
          <Dialog title={__('error')}>
            <div>
              <Translated name='errorDesc' />
            </div>
            <Alert>{`${error.error} while processing ${error.type}`}</Alert>
            <div className='footer'>
              <button onClick={this.handleDismiss.bind(this)}
              ref='dismiss'>
                <Translated name='dismiss' />
              </button>
            </div>
          </Dialog>
        </div>
      </div>
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
