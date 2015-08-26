import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import App from './App.js';

export default class Root extends React.Component {
  render() {
    return (
      <div>
        <Provider store={this.props.store}>
          {() =>
            <Router history={this.props.history}>
              <Route path='/' component={App} />
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
