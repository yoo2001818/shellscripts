import Express from 'express';
import registerMiddlewares from './lib/middleware.js';
import dbInit from '../db/index.js';

import passport from './lib/passport.js';

export default function createRouter() {
  return dbInit()
  .then((db) => {
    const router = new Express.Router();
    registerMiddlewares(router);
    router.get('/session', (req, res) => {
      // This kinda looks silly
      res.send(req.session.session);
    });
    router.post('/session', passport.authenticate('local'), (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });
    /*router.post('/session', (req, res) => {
      req.session.session = {
        logged: true
      };
      res.send({test: 'hello'});
      //res.status(403).send('Not implemented yet');
    });*/
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
    return router;
  });
}
