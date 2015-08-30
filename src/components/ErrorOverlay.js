import './style/ErrorOverlay.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { errorDismiss } from '../actions/load.js';
import Dialog from './Dialog.js';
import Alert from './Alert.js';

class ErrorOverlay extends Component {
  handleDismiss() {
    this.props.errorDismiss();
  }
  render() {
    const { load: { error } } = this.props;
    if (!error) return false;
    return (
      <div id='errorCover'>
        <div className='middle'>
          <Dialog title='Error'>
            <div>{`An error occurred. This might be a network problem, or
            the server's problem. If the problem persists, please contact
            us.`}</div>
            <Alert>{`${error.error} while processing ${error.type}`}</Alert>
            <div className='footer'>
              <button onClick={this.handleDismiss.bind(this)}>Dismiss</button>
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}

ErrorOverlay.propTypes = {
  load: PropTypes.object.isRequired,
  errorDismiss: PropTypes.func.isRequired
};

export default connect(
  (state) => ({load: state.load}),
  { errorDismiss }
)(ErrorOverlay);
