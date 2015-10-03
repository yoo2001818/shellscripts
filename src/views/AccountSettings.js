import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import translate from '../lang/index.js';
import Translated from '../components/Translated.js';
import LabelInput from '../components/LabelInput.js';

class GeneralSettings extends Component {
  render() {
    const __ = translate(this.props.lang.lang);
    return (
      <div id='settings-account'>
        <section>
          <h1>
            <Translated name='accountSettings' />
          </h1>
          <div className='content'>
            <LabelInput label={__('username')}>
              <input />
            </LabelInput>
          </div>
        </section>
      </div>
    );
  }
}

GeneralSettings.propTypes = {
  lang: PropTypes.object
};

export default connect(
  store => ({lang: store.lang})
)(GeneralSettings);
