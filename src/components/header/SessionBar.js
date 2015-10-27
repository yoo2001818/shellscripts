import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import DropDownMenu from '../ui/DropDownMenu.js';
import Translated from '../ui/Translated.js';
import { logout } from '../../actions/session.js';
import translate from '../../lang/index.js';
import userPlaceholder from '../../assets/userPlaceholder.png';

class SessionBar extends Component {
  handleLogout(e) {
    e.preventDefault();
    const { session } = this.props;
    if (session.load.loading) return;
    this.props.logout();
    return;
  }
  render() {
    const __ = translate(this.props.lang.lang);
    const { session, user } = this.props;
    if (session.load.loading) {
      return (
        <div className='session loading'>
          <i className="fa fa-refresh fa-spin"></i>
        </div>
      );
    }
    if (user) {
      if (!user.signedUp) {
        return (
          <div className='session' />
        );
      }
      return (
        <div className='session'>
          <DropDownMenu title={(
            <i className='fa fa-plus' />
          )} caption={__('createNew')} href={`/new`}>
            <ul>
              <li>
                <Link to='/new'>
                  <Translated name='newScript' />
                </Link>
              </li>
              <li>
                <Link to='/new/list'>
                  <Translated name='newList' />
                </Link>
              </li>
            </ul>
          </DropDownMenu>
          <DropDownMenu title={(
            <img className='profile' src={user.photo || userPlaceholder}/>
          )} caption={__('profileAndSettings')} href={`/${user.username}`}>
            <ul>
              <li>
                <Link to={`/${user.username}`}>
                  <p className='bold'>{ user.name || user.username }</p>
                  <p className='small right'>
                    <Translated name='viewProfile' />
                  </p>
                </Link>
              </li>
              <li>
                <Link to='/settings'>
                  <Translated name='settings' />
                </Link>
              </li>
              <li>
                <Link to='/logout' onClick={this.handleLogout.bind(this)}>
                  <Translated name='signOut' />
                </Link>
              </li>
            </ul>
          </DropDownMenu>
        </div>
      );
    } else {
      return (
        <div className='session'>
          <Link to='/login'>
            <Translated name='signIn' />
          </Link>
          <Link to='/signup'>
            <Translated name='signUp' />
          </Link>
          {
            session.error ? (
              <span><i className="fa fa-exclamation-triangle"></i></span>
            ) : null
          }
        </div>
      );
    }
  }
}

SessionBar.propTypes = {
  session: PropTypes.object,
  user: PropTypes.object,
  lang: PropTypes.object,
  logout: PropTypes.func.isRequired
};

export default connect(
  state => {
    const { session, entities: { users }, lang } = state;
    const user = users[session.login];
    return { session, user, lang };
  },
  { logout }
)(SessionBar);
