import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App.js';
import NotFound from './NotFound.js';
import Index from './Index.js';
import Login from './Login.js';
import Search from './Search.js';
import SignUp from './SignUp.js';

export const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Index} />
    <Route path='login' component={Login} />
    <Route path='signup' component={SignUp} />
    <Route path='search' component={Search} />
    <Route path='*' component={NotFound} />
  </Route>
);

export default routes;
