// Server init point

import express from 'express';
import ServeStatic from 'serve-static';

let app = express();

// Currently server does nothing but serve static files.
app.use(new ServeStatic('./dist'));

app.listen(8000, () => {
  console.log('server started');
});
