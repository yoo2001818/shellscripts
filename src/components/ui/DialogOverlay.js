import './style/Overlay.scss';

import React, { Component, PropTypes } from 'react';
import Dialog from './Dialog.js';
import Overlay from './Overlay.js';

export default class DialogOverlay extends Component {
  render() {
    return (
      <Overlay className='fixed'>
          <Dialog {...this.props}>
            {this.props.children}
          </Dialog>
      </Overlay>
    );
  }
}

DialogOverlay.propTypes = {
  children: PropTypes.any
};
