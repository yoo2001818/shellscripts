import Express from 'express';
import registerMiddlewares from './lib/middleware.js';
import dbInit from '../db/index.js';

import passport from './lib/passport.js';
import { register } from './lib/auth/local.js';

export default function createRouter() {
  return dbInit()
  .then((db) => {
    const router = new Express.Router();
    registerMiddlewares(router);
    router.get('/session', (req, res) => {
      // This kinda looks silly
      res.send(req.user || {});
    });
    router.post('/session', passport.authenticate('local'), (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.send(req.user || {});
    });
    router.delete('/session', (req, res) => {
      req.logout();
      res.send({});
    });
    router.all('/user/auth/local', (req, res) => {
      register(req, req.query, (err) => {
        if (err) return res.status(500).send(err.message);
        res.send(req.user || {});
      });
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
