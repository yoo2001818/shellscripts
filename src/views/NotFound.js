import './style/NotFound.scss';

import React, { Component } from 'react';
import Translated from '../components/Translated.js';

export default class NotFound extends Component {
  render() {
    return (
      <div id="error-404">
        <h1>
          <Translated name='pageNotFound' />
        </h1>
        <p>
          <Translated name='pageNotFoundDesc' />
        </p>
      </div>
    );
  }
}
