import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import App from './App.js';

export default class Root extends Component {
  render() {
    return (
      <div id='root'>
        <Provider store={this.props.store}>
          {() =>
            <Router history={this.props.history}>
              <Route path='/' component={App}>
              </Route>
            </Router>
          }
        </Provider>
      </div>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
