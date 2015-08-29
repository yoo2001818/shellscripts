import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import apiMiddleware from '../middleware/api.js';

import dummyClient from '../api/client.js';

import * as reducers from '../reducers';

const reducer = combineReducers(reducers);
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  apiMiddleware(dummyClient),
  promiseMiddleware,
  createLogger()
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
