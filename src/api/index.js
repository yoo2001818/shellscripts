import Express from 'express';
import registerMiddlewares from './lib/middleware.js';

import passport from './lib/passport.js';
import { register } from './lib/auth/local.js';
import strategies from './lib/auth/strategy.js';

export default function createRouter() {
  const router = new Express.Router();
  registerMiddlewares(router);
  router.get('/session', (req, res) => {
    // This kinda looks silly
    res.send(req.user || {});
  });
  router.get('/session/method', (req, res) => {
    let methodList = [];
    for (let method in strategies) {
      if (!strategies[method].enabled) continue;
      methodList.push(Object.assign({}, strategies[method], {
        strategy: undefined,
        identifier: method
      }));
    }
    res.send(methodList);
  });
  router.all('/session/:method', (req, res, next) => {
    // Check name validity
    const strategy = strategies[req.params.method];
    if (strategy == null || strategy.enabled === false) next();
    passport.authenticate(req.params.method, (err, user, info) => {
      if (err) {
        res.status(401);
        res.send(err);
        console.log(err);
        return;
      }
      if (!user) {
        res.status(401);
        res.send(info);
        console.log(info);
        return;
      }
      req.login(user, (error) => {
        if (error) {
          res.status(401);
          res.send(error);
          return;
        }
        if (strategy.redirect) {
          if (user.signedUp) res.redirect('/login');
          else res.redirect('/signup');
          return;
        } else {
          res.send(user);
          return;
        }
      });
    })(req, res, next);
  });
  router.all('/session/local/register', (req, res) => {
    register(req, req.query, (err) => {
      if (err) return res.status(500).send(err.message);
      res.send(req.user || {});
    });
  });
  router.delete('/session', (req, res) => {
    req.logout();
    res.send({});
  });
  router.get('/search', (req, res) => {
    res.send({});
  });
  router.use((req, res) => {
    res.sendStatus(404);
  });
  return Promise.resolve(router);
}
