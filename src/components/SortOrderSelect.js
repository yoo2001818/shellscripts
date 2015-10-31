import './style/SortOrderSelect.scss';

import React, { Component, PropTypes } from 'react';

import Translated from './ui/Translated.js';
import DropDownMenu from './ui/DropDownMenu.js';

const ORDER_TYPES = ['id', 'idRev', 'star'];

export default class SortOrderSelect extends Component {
  handleChange(type) {
    // Change received..
    if (this.props.onChange) this.props.onChange(type);
    // Don't call preventDefault; we've got to close dropdown menu
  }
  render() {
    const { list } = this.props;
    if (list == null) return false;
    return (
      <div className='sort-order-select'>
        <DropDownMenu title={(
          <span className='sort-order-title'>
            <span className='title'>
              <Translated name='orderTitle' />
            </span>
            <span className='description'>
              <Translated name={'order_' + list.order} />
            </span>
          </span>
        )}>
          <ul>
            { ORDER_TYPES.map(type => (
              <li key={type}>
                <a href='#'
                  onClick={this.handleChange.bind(this, type)}
                >
                  <Translated name={'order_' + type} />
                </a>
              </li>
            ))}
          </ul>
        </DropDownMenu>
      </div>
    );
  }
}

SortOrderSelect.propTypes = {
  list: PropTypes.object,
  onChange: PropTypes.func
};
