import './style/NotFound.scss';
import notFoundImage from './assets/notFound.png';

import React, { Component } from 'react';
import Translated from '../components/Translated.js';

export default class NotFound extends Component {
  render() {
    return (
      <div id="error-404">
        <h1>
          <Translated name='pageNotFound' />
        </h1>
        <img src={notFoundImage} />
        <p>
          <Translated name='pageNotFoundDesc' />
        </p>
      </div>
    );
  }
}
