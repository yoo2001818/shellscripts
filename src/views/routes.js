import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App.js';
import NotFound from './NotFound.js';
import Index from './Index.js';
import Login from './Login.js';
import Search from './Search.js';
import SignUp from './SignUp.js';
import User from './User.js';
import UserEntries from './userProfile/UserEntries.js';
import UserStarred from './userProfile/UserStarred.js';
import Settings from './Settings.js';
import AccountSettings from './settings/AccountSettings.js';
import AuthMethodSettings from './settings/AuthMethodSettings.js';
import Entry from './Entry.js';
import EntryView from './EntryView.js';
import EntryEdit from './EntryEdit.js';
import EntryCreate from './EntryCreate.js';
import ListCreate from './ListCreate.js';

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
    <Route path='new'>
      <IndexRoute component={EntryCreate} />
      <Route path='list' component={ListCreate} />
    </Route>
    <Route path=':username' component={User}>
      <IndexRoute component={UserEntries} />
      <Route path='starred' component={UserStarred} />
      <Route path=':entryname' component={Entry}>
        <IndexRoute component={EntryView} />
        <Route path='edit' component={EntryEdit} />
      </Route>
    </Route>
    <Route path='*' component={NotFound} />
  </Route>
);

export default routes;
