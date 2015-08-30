import { compose, createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import apiMiddleware from '../middleware/api.js';

import dummyClient from '../api/client.js';

import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
const middlewares = applyMiddleware(
  thunkMiddleware,
  apiMiddleware(dummyClient),
  promiseMiddleware,
  createLogger()
);

let createStoreWithMiddleware = middlewares(createStore);

if (__CLIENT__ && __DEVELOPMENT__) {
  const { devTools, persistState } = require('redux-devtools');
  createStoreWithMiddleware = compose(
    middlewares,
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
  );
}

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
