import { compose, createStore, applyMiddleware, combineReducers } from 'redux';

import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from '../middleware/promise.js';
import createLogger from 'redux-logger';
import apiMiddleware from '../middleware/api.js';
import normalizeMiddleware from '../middleware/normalize.js';
import injectReplaceMiddleware from '../middleware/injectReplace.js';

import * as reducers from '../reducers';

let logger;
if (__SERVER__) {
  logger = () => next => action => next(action);
} else {
  logger = createLogger();
}

export default function configureStore(initialState, client) {
  const reducer = combineReducers(reducers);
  const middlewares = applyMiddleware(
    thunkMiddleware,
    apiMiddleware(client),
    promiseMiddleware,
    normalizeMiddleware,
    injectReplaceMiddleware,
    logger
  );

  let createStoreWithMiddleware = middlewares(createStore);

  if (__CLIENT__ && __DEVELOPMENT__ && __DEVTOOLS__) {
    const { devTools, persistState } = require('redux-devtools');
    createStoreWithMiddleware = compose(
      middlewares,
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  }

  return createStoreWithMiddleware(reducer, initialState);
}
