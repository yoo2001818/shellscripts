import Express from 'express';
import httpProxy from 'http-proxy';

import netConfig from '../../config/network.config.js';

export const router = new Express.Router();
export default router;

const proxy = httpProxy.createProxyServer({
  target: netConfig.apiUrl
  // ws: true
});

router.use((req, res) => {
  proxy.web(req, res);
});

proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {
    id: 'API_SERVER_ERROR',
    message: error.message
  };
  res.end(JSON.stringify(json));
});
