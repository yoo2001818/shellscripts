import './style/App.scss';
import React, { Component, PropTypes } from 'react';
import { load } from '../actions/session.js';
import ProgressBar from '../components/ProgressBar.js';
import Header from '../components/Header.js';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    // Doing this because we want an isomorphic app.
    // Well it's not an isomorphic app currently.
    return this.constructor.fetchData(this.context.store);
  }
  render() {
    let { children } = this;
    return (
      <div id='app'>
        <Header />
        {children}
        <ProgressBar />
      </div>
    );
  }
  static fetchData(store) {
    return store.dispatch(load());
  }
}

App.contextTypes = {
  store: PropTypes.object.isRequired
};
