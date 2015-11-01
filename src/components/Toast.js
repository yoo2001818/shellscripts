import './style/Toast.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { close } from '../actions/toast.js';
import translate from '../lang/index.js';

class Toast extends Component {
  handleDismiss() {
    this.props.close();
  }
  componentDidUpdate(oldProps) {
    if (oldProps && oldProps.toast && oldProps.toast.open) return;
    if (this.props.toast.open) {
      setTimeout(this.handleDismiss.bind(this), 3000);
    }
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { toast: { open, body } } = this.props;
    let translatedBody = body || false;
    if (body && body.translated) {
      translatedBody = __(body.translated, body.props);
    }
    return (
      <div className={classNames('toast-container', { open })}
        onMouseDown={this.handleDismiss.bind(this)}
        onClick={this.handleDismiss.bind(this)}
      >
        <div className='toast'>
          {translatedBody}
        </div>
      </div>
    );
  }
}

Toast.propTypes = {
  lang: PropTypes.object,
  toast: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired
};

export default connect(
  (state) => ({toast: state.toast, lang: state.lang}),
  { close }
)(Toast);
