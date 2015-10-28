// API entry point
import express from 'express';
import morgan from 'morgan';
import apiRouter from './api/index.js';

import netConfig from '../config/network.config.js';

let app = express();

if (__DEVELOPMENT__) app.set('json spaces', 2);

app.use(morgan('dev'));
app.use(apiRouter);

app.listen(netConfig.apiPort, () => {
  console.log('API server started');
});
