import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AutoExpandTextArea extends Component {
  handleChange(e) {
    if (this.props.noNewLine) {
      const newValue = e.target.value.replace(/[\n\r]+/g, '');
      if (e.target.value !== newValue) e.target.value = newValue;
    }
    const offset = e.target.offsetHeight - e.target.clientHeight;
    // Save scroll position and restore them...
    const { scrollTop } = document.documentElement;
    setTimeout(() => {
      e.target.style.height = 'auto';
      e.target.style.height = (e.target.scrollHeight + offset) + 'px';
      document.documentElement.scrollTop = scrollTop;
    }, 0);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }
  render() {
    return (
      <textarea {...this.props} onChange={this.handleChange.bind(this)}
        rows={1} className={classNames(this.props.className, 'noresize')}/>
    )
  }
}

AutoExpandTextArea.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  noNewLine: PropTypes.bool
}
