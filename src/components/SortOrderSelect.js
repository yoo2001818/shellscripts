import './style/SortOrderSelect.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Translated from './ui/Translated.js';
import DropDownMenu from './ui/DropDownMenu.js';

const ORDER_TYPES = ['id', 'idRev', 'star'];

class SortOrderSelect extends Component {
  handleChange(type) {
    // Change received..
    if (this.props.onChange) this.props.onChange(type);
    // Don't call preventDefault; we've got to close dropdown menu
  }
  render() {
    const { list, user } = this.props;
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
            { user && user.isAdmin ? (
              <li>
                <a href='#'
                  onClick={this.handleChange.bind(this, 'report')}
                >
                  <Translated name={'order_report'} />
                </a>
              </li>
            ) : false }
          </ul>
        </DropDownMenu>
      </div>
    );
  }
}

SortOrderSelect.propTypes = {
  list: PropTypes.object,
  user: PropTypes.object,
  onChange: PropTypes.func
};

export default connect(
  state => {
    const { session, entities: { users } } = state;
    return {
      user: users[session.login]
    };
  }
)(SortOrderSelect);
