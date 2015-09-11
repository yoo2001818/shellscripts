import './style/Accordion.scss';

import React, { Component, PropTypes } from 'react';
import Dialog from './Dialog.js';

export default class Accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
  }
  handleClick() {
    this.setState({hidden: !this.state.hidden});
  }
  render() {
    const title = (
      <button onClick={this.handleClick.bind(this)}>{this.props.title}</button>
    );
    return (
      <Dialog className='dialog accordion' titleObj={title}
        title={this.props.title} hidden={this.state.hidden}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any
};
