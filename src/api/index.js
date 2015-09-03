import Express from 'express';
import registerMiddlewares from './lib/middleware.js';

export default function createRouter() {
  const router = new Express.Router();

  registerMiddlewares(router);

  router.get('/session', (req, res) => {
    // This kinda looks silly
    res.send(req.session.session);
  });

  router.post('/session', (req, res) => {
    req.session.session = {
      logged: true
    };
    res.send({test: 'hello'});
    //res.status(403).send('Not implemented yet');
  });

  router.delete('/session', (req, res) => {
    req.session.session = {
      logged: false
    };
    res.send({test: 'hello'});
  });

  router.get('/search', (req, res) => {
    res.send({});
  });

  router.use((req, res) => {
    res.sendStatus(404);
  });

  return Promise.resolve(router);
}
