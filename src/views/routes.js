import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App.js';
import NotFound from './NotFound.js';
import Index from './Index.js';
import Login from './Login.js';
import Search from './Search.js';
import SignUp from './SignUp.js';
import User from './User.js';
import UserProfile from './UserProfile.js';
import Settings from './Settings.js';
import AccountSettings from './settings/AccountSettings.js';
import AuthMethodSettings from './settings/AuthMethodSettings.js';
import Entry from './Entry.js';
import EntryView from './EntryView.js';

export const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Index} />
    <Route path='login' component={Login} />
    <Route path='signup' component={SignUp} />
    <Route path='search' component={Search} />
    <Route path='settings' component={Settings}>
      <IndexRoute component={AccountSettings} />
      <Route path='authMethods' component={AuthMethodSettings} />
      <Route path='*' component={NotFound} />
    </Route>
    <Route path=':username' component={User}>
      <IndexRoute component={UserProfile} />
      <Route path=':entry' component={Entry}>
        <IndexRoute component={EntryView} />
      </Route>
    </Route>
    <Route path='*' component={NotFound} />
  </Route>
);

export default routes;
