import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { add, remove } from '../actions/listCart.js';
import Translated from './ui/Translated.js';

class AddToListCart extends Component {
  getId() {
    const { entry } = this.props;
    return entry.author.username.toLowerCase() + '/' + entry.name;
  }
  getIndex() {
    const { listCart: { list } } = this.props;
    return list.indexOf(this.getId());
  }
  hasItem() {
    return this.getIndex() !== -1;
  }
  handleToggle() {
    if (this.hasItem()) {
      this.props.remove(this.getIndex());
    } else {
      this.props.add(this.getId());
    }
  }
  render() {
    const { listCart } = this.props;
    if (!listCart.enabled) return false;
    return (
      // I'm not sure why I'm using span tag.
      <span className='list-cart-add'>
        <button
          className={classNames({
            'red-button': this.hasItem()
          })}
          onClick={this.handleToggle.bind(this)}
        >
          <i className='fa fa-list' />
          <Translated
            name={this.hasItem() ? 'listCartRemove' : 'listCartAdd'}
          >
            {this.getIndex() + 1}
          </Translated>
        </button>
      </span>
    );
  }
}

AddToListCart.propTypes = {
  listCart: PropTypes.object,
  entry: PropTypes.object,
  add: PropTypes.func,
  remove: PropTypes.func
};

export default connect(
  store => ({
    listCart: store.listCart
  }),
  { add, remove }
)(AddToListCart);
