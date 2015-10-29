import './style/DropDownMenu.scss';

import ToolTip from './ToolTip.js';
import classNames from 'classnames';
import React, { Component, PropTypes, cloneElement } from 'react';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true
    };
    this.handleClickEvent = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.refs.cover.removeEventListener('click', this.handleClickEvent);
  }
  handleClick(e) {
    const { hidden } = this.state;
    if (hidden) {
      this.refs.cover.addEventListener('click', this.handleClickEvent);
    } else {
      this.refs.cover.removeEventListener('click', this.handleClickEvent);
    }
    if (this.mounted) {
      this.setState({
        hidden: !hidden
      });
    }
    e.preventDefault();
  }
  render() {
    const { hidden } = this.state;
    const buttonContent = (
      <a href={this.props.href || '#'}>
        <span className='title'>{this.props.title}</span>
        <i className='icon fa fa-caret-down'></i>
      </a>
    );
    return (
      <div className={classNames('dropdown', { hidden })}>
        <div className='cover' ref='cover'></div>
        <div className='button' onClick={this.handleClick.bind(this)}>
          {this.props.caption ? (
            <ToolTip caption={this.props.caption} className='right'>
              {buttonContent}
            </ToolTip>
          ) : buttonContent}
        </div>
        <div className='arrow'>
        </div>
        <div className='content'>
          { this.props.preventClose ? (
            this.props.children
          ) : (
            cloneElement(this.props.children, {
              onClick: this.handleClick.bind(this)
            })
          ) }
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  href: PropTypes.string,
  caption: PropTypes.string,
  children: PropTypes.any,
  title: PropTypes.any,
  preventClose: PropTypes.bool
};
