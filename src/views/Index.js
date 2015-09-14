import React, { Component } from 'react';
import Translated from '../components/Translated.js';

export default class Index extends Component {
  render() {
    return (
      <div>
        <h1>
          <Translated name='hello'>{'World'}</Translated>
        </h1>
      </div>
    );
  }
}
