import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import translate from '../../lang/index.js';
import Translated from '../../components/ui/Translated.js';
// import LabelInput from '../../components/LabelInput.js';

class AccountSettings extends Component {
  render() {
    // const __ = translate(this.props.lang.lang);
    return (
      <div id='settings-account'>
        <section>
          <h1>
            <Translated name='accountSettings' />
          </h1>
          <div className='content'>
            <p>Nothing in here yet!</p>
            <div className='footer'>
              <button>Save</button>
            </div>
          </div>
        </section>
        <section>
          <h1>
            Test
          </h1>
          <div className='content'>
            Hello!
          </div>
        </section>
      </div>
    );
  }
}

AccountSettings.propTypes = {
  lang: PropTypes.object
};

export default connect(
  store => ({lang: store.lang})
)(AccountSettings);
