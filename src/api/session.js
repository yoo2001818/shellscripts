import Express from 'express';
import passport from './lib/passport.js';
import { register } from './lib/auth/local.js';
import strategies from './lib/auth/strategy.js';

export const router = new Express.Router();
export default router;

/**
 * @api {get} /session/ Get current user
 * @apiGroup Session
 * @apiName GetSession
 * @apiSuccess {User} user Current user object or {}.
 */
router.get('/', (req, res) => {
  // This kinda looks silly
  res.send(req.user || {});
});

/**
 * @api {get} /session/method Get available auth methods
 * @apiGroup Session
 * @apiName GetAuthMethod
 * @apiSuccess {Strategy[]} method List of methods
 */
router.get('/method', (req, res) => {
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

/**
 * @api /session/:method Sign in using specified auth method
 * @apiParam {String} [method] The method to use.
 * @apiGroup Session
 * @apiName SignIn
 */
router.all('/:method', (req, res, next) => {
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

router.all('/local/register', (req, res) => {
  register(req, req.body, (err) => {
    if (err) return res.status(500).send(err.message);
    res.send(req.user || {});
  });
});

/**
 * @api {delete} /session/ Sign out
 * @apiGroup Session
 * @apiName SignOut
 */
router.delete('/', (req, res) => {
  req.logout();
  res.send({});
});
