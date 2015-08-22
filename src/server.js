// Server init point

import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import ServeStatic from 'serve-static';

let app = express();

app.use(new ServeStatic('./dist'));

app.listen(8000, () => {
  console.log('server started');
});
