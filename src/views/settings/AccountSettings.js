import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { save as saveLang } from '../../actions/lang.js';
import translate, { localeList } from '../../lang/index.js';
import Translated from '../../components/ui/Translated.js';
import LabelInput from '../../components/ui/LabelInput.js';
import EmailChangeForm from '../../components/forms/EmailChangeForm.js';

class AccountSettings extends Component {
  handleLangChange(e) {
    console.log(e.target.value);
    this.props.saveLang(e.target.value);
  }
  render() {
    const __ = translate(this.props.lang.lang);
    return (
      <div id='settings-account'>
        <section>
          <h1>
            <Translated name='accountSettings' />
          </h1>
          <div className='content'>
            <LabelInput label={__('language')} className='oneline'>
              <select
                value={this.props.lang.lang}
                onChange={this.handleLangChange.bind(this)}
              >
                { Object.keys(localeList).map((key, idx) => (
                  <option value={key} key={idx}>
                    {localeList[key]}
                  </option>
                ))}
              </select>
            </LabelInput>
          </div>
        </section>
        <section>
          <h2>
            <Translated name='emailTitle' />
          </h2>
          <div className='content'>
            <EmailChangeForm initialValues={this.props.user} />
          </div>
        </section>
      </div>
    );
  }
}

AccountSettings.propTypes = {
  user: PropTypes.object,
  lang: PropTypes.object,
  saveLang: PropTypes.func
};

export default connect(
  state => {
    const { session, lang, entities: { users } } = state;
    const user = users[session.login];
    return { user, lang };
  },
  { saveLang }
)(AccountSettings);
