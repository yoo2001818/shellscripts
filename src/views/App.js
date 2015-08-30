import './style/App.scss';
import React, { Component, PropTypes } from 'react';
import { RouteHandler } from 'react-router';
import { load } from '../actions/session.js';
import ProgressBar from '../components/ProgressBar.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id='app'>
        <Header />
        <div id='content'>
          <RouteHandler />
        </div>
        <Footer />
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
