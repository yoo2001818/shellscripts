import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { load, login, logout } from '../actions/session.js';

class App extends Component {
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
        <p>
          {this.props.session ? 'Hello!' : 'Loading!'}
        </p>
        {children}
      </div>
    );
  }
  static fetchData(store) {
    return store.dispatch(load());
  }
}

App.propTypes = {
  session: PropTypes.object,
  load: PropTypes.func.isRequired
};

App.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    session: state.session
  };
}

export default connect(
  mapStateToProps,
  { load, login, logout }
)(App);
