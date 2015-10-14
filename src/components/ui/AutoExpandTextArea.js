import React, { Component, PropTypes } from 'react';

export default class AutoExpandTextArea extends Component {
  handleChange(e) {
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
        rows={1} />
    )
  }
}

AutoExpandTextArea.propTypes = {
  onChange: PropTypes.func
}
