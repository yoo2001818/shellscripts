import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { oAuthSignUp, methodDelete, methodFetch }
  from '../../actions/session.js';
// import translate from '../../lang/index.js';
import Translated from '../../components/ui/Translated.js';
import LoadingOverlay from '../../components/ui/LoadingOverlay.js';
// import LabelInput from '../../components/LabelInput.js';

class AuthMethodSettings extends Component {
  handleDelete(provider, e) {
    this.props.methodDelete(provider);
    e.preventDefault();
  }
  handleOAuth(provider, e) {
    // This requires actual page forwarding...
    window.location = '/api/session/' + provider;
    // oAuth only has one method..
    this.props.oAuthSignUp();
    e.preventDefault();
  }
  render() {
    const { method, loading } = this.props;
    const methods = _.values(method);
    const methodEnabledCount = methods.reduce(
      (sum, element) => sum + (element.inUse ? 1 : 0), 0);
    const methodTags = methods.map(provider => {
      if (provider.inUse) {
        return (
          <div className='authMethod' key={provider.identifier}>
            <h2>{provider.name}</h2>
            <div className='actions'>
              { methodEnabledCount > 1 ? (
                <button className='red-button'
                  onClick={this.handleDelete.bind(this, provider.identifier)}
                >
                  <Translated name='unregister' />
                </button>
              ) : (
                <button disabled>
                  <Translated name='unregister' />
                </button>
              ) }
            </div>
          </div>
        );
      } else {
        return (
          <div className='authMethod' key={provider.identifier}>
            <h2>{provider.name}</h2>
            <div className='actions'>
              <button
                onClick={this.handleOAuth.bind(this, provider.identifier)}
              >
                <Translated name='register' />
              </button>
            </div>
          </div>
        );
      }
    });
    // const __ = translate(this.props.lang.lang);
    return (
      <div id='settings-account'>
        <section>
          <h1>
            <Translated name='authMethods' />
          </h1>
          <div className='content'>
            { methodTags }
          </div>
          <LoadingOverlay loading={loading} />
        </section>
      </div>
    );
  }
}

AuthMethodSettings.propTypes = {
  lang: PropTypes.object,
  method: PropTypes.object,
  oAuthSignUp: PropTypes.func,
  methodDelete: PropTypes.func,
  loading: PropTypes.bool
};

export const ConnectAuthMethodSettings = connect(
  store => ({
    lang: store.lang,
    method: store.session.method,
    loading: store.session.load.loading
  }),
  { oAuthSignUp, methodDelete }
)(AuthMethodSettings);

ConnectAuthMethodSettings.fetchData = function(store) {
  return store.dispatch(methodFetch());
}

export default ConnectAuthMethodSettings;
