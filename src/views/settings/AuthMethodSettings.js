import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import translate from '../../lang/index.js';
import Translated from '../../components/ui/Translated.js';
// import LabelInput from '../../components/LabelInput.js';

class AuthMethodSettings extends Component {
  render() {
    // const __ = translate(this.props.lang.lang);
    return (
      <div id='settings-account'>
        <section>
          <h1>
            <Translated name='authMethods' />
          </h1>
          <div className='content'>
            <p>Nothing in here yet! :P</p>
          </div>
        </section>
      </div>
    );
  }
}

AuthMethodSettings.propTypes = {
  lang: PropTypes.object
};

export default connect(
  store => ({lang: store.lang})
)(AuthMethodSettings);
