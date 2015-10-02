import './style/DropDownMenu.scss';

import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
  }
  handleClick() {
    this.setState({
      hidden: !this.state.hidden
    });
  }
  render() {
    const { hidden } = this.state;
    return (
      <div className={classNames('dropdown', { hidden })}>
        <div className='button' onClick={this.handleClick.bind(this)}>
          <span className='title'>{this.props.title}</span>
          <i className='icon fa fa-caret-down'></i>
        </div>
        <div className='arrow'>
        </div>
        <div className='content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.any,
  title: PropTypes.any
};
