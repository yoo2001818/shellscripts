import './style/NotFound.scss';

import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    return (
      <div id="error-404">
        <h1>Page not found</h1>
        <p>
          {`Sorry, we couldn't find the page you've requested.`}
        </p>
      </div>
    );
  }
}
