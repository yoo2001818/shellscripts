import React from 'react';
import { Route, NotFoundRoute, DefaultRoute } from 'react-router';

import App from './App.js';
import NotFound from './NotFound.js';
import Index from './Index.js';
import Login from './Login.js';

export const routes = (
  <Route path='/' handler={App}>
    <DefaultRoute handler={Index} />
    <Route path='login' handler={Login} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

export default routes;
