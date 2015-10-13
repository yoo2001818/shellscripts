import Express from 'express';
import passport from './lib/passport.js';
import { register } from './lib/auth/local.js';
import strategies from './lib/auth/strategy.js';
import authRequired from './lib/authRequired.js';
import { Passport } from '../db/index.js';

function validateAuthRequest(req, res, next) {
  const { method } = req.params;
  const strategy = strategies[method];
  if (strategy == null) {
    res.status(404);
    res.json({
      id: 'AUTH_METHOD_NOT_FOUND',
      message: 'Specified authentication method is not found.'
    });
    return;
  }
  if (strategy.enabled === false) {
    res.status(403);
    res.json({
      id: 'AUTH_METHOD_DISABLED',
      message: 'The authentication method is disabled.'
    });
    return;
  }
  if (strategy.redirect !== true && req.method === 'GET') {
    res.status(405);
    res.json({
      id: 'AUTH_REDIRECTION_USE_POST',
      message: 'This authentication method doesn\'t use redirection. ' +
        'Please use POST request instead.'
    });
    return;
  }
  if (strategy.redirect !== false && req.method === 'POST') {
    res.status(405);
    res.json({
      id: 'AUTH_REDIRECTION_USE_GET',
      message: 'This authentication method uses redirection. ' +
        'Please use GET request instead.'
    });
    return;
  }
  if (req.user) {
    // While multiple passports of single type is possible to implement,
    // nobody would use multiple passports of single type.
    req.user.getPassports({
      where: {
        type: method
      }
    })
    .then(passports => {
      if (passports.length) {
        res.status(403);
        res.json({
          id: 'AUTH_METHOD_ALREADY_EXISTS',
          message: 'You already have this authentication method. You\'ll ' +
            'need to unregister current method in order to register new one.'
        });
        return;
      }
      next();
    });
  } else {
    next();
  }
}

export const router = new Express.Router();
export default router;

/**
 * @api {get} /session/ Get current user session
 * @apiGroup Session
 * @apiName GetSession
 * @apiDescription Returns current user object.
 *
 *   This will fail if user hasn't signed in.
 *
 * @apiSuccessExample {json} If user has signed in:
 *   HTTP/1.1 200 OK
 *   {
 *     "username": "Username",
 *     "email": "Email"
 *   }
 * @apiErrorExample {json} If user hasn't signed in:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_NOT_SIGNED_IN",
 *     "message": "Not signed in"
 *   }
 */
router.get('/session/', authRequired, (req, res) => {
  res.json(req.user);
});

/**
 * @api {get} /session/methods/ Get available auth methods
 * @apiGroup Session
 * @apiName GetAuthMethods
 * @apiDescription Returns a object of available auth methods.
 *
 *   This will return brief information about user's registered auth methods
 *   if the user has signed in.
 *
 * @apiSuccessExample {json} If user has signed in:
 *   HTTP/1.1 200 OK
 *   {
 *     "local": {
 *       "name": "Local",
 *       "identifier": "local",
 *       "enabled": true,
 *       "redirect": false,
 *       "inUse": true
 *     },
 *     "facebook": {
 *       "name": "Facebook",
 *       "identifier": "facebook",
 *       "enabled": true,
 *       "redirect": true,
 *       "inUse": false
 *     }
 *   }
 * @apiSuccessExample {json} If user hasn't signed in:
 *   HTTP/1.1 200 OK
 *   {
 *     "local": {
 *       "name": "Local",
 *       "identifier": "local",
 *       "enabled": true,
 *       "redirect": false
 *     },
 *     "facebook": {
 *       "name": "Facebook",
 *       "identifier": "facebook",
 *       "enabled": true,
 *       "redirect": true
 *     }
 *   }
 */
router.get('/session/methods/', (req, res) => {
  let methodList = {};
  for (let method in strategies) {
    if (!strategies[method].enabled) continue;
    methodList[method] = Object.assign({}, strategies[method], {
      strategy: undefined,
      identifier: method,
      inUse: req.user ? false : undefined
    });
  }
  if (req.user) {
    // If user has signed in, inject 'inUse'
    req.user.getPassports()
    .then(passports => {
      passports.forEach(passportObj => {
        methodList[passportObj.type].inUse = true;
      });
      res.json(methodList);
    });
  } else {
    res.json(methodList);
  }
});

/**
 * @api {get} /session/:method Sign in using the auth method /w redirection
 * @apiParam (Parameter) {String} [method] The method to use.
 * @apiGroup Session
 * @apiName SignInRedirect
 * @apiDescription Sign in using the auth method.
 *
 *   The auth method should use redirection in order to use, or it will return
 *   405 Method Not Allowed.
 *   If the auth method is disabled, it will return 403 Forbidden.
 *   If the user has already signed in, this will register the auth method to
 *   the user. But if the user already has the auth method, this will return
 *   403 Forbidden.
 *   Otherwise, this will try to sign in. If the user doesn't exist, it'll
 *   create a new one in oAuth.
 *
 *   Whether if signing in succeeds or not, this will redirect the user to
 *   /login page, because this requires user to directly visit this page,
 *   Not through ajax or something.
 *
 *   The result will be saved in the cookie, if available.
 *   /session will return last auth error information saved in the cookie.
 *
 * @apiErrorExample {json} If auth method doesn't use redirection:
 *   HTTP/1.1 405 Method Not Allowed
 *   {
 *     "id": "AUTH_REDIRECTION_USE_POST",
 *     "message": "This authentication method doesn't use redirection.
 *               Please use POST request instead."
 *   }
 * @apiErrorExample {json} If user has signed in and has the auth method:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_METHOD_ALREADY_EXISTS",
 *     "message": "You already have this authentication method. You'll need to
 *               unregister current method in order to register new one."
 *   }
 * @apiErrorExample {json} If auth method is disabled:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_METHOD_DISABLED",
 *     "message": "The authentication method is disabled."
 *   }
 */
router.get('/session/:method', validateAuthRequest, (req, res, next) => {
  passport.authenticate(req.params.method, (err, user, info) => {
    if (err) {
      // Store error to cookie and redirect
      res.status(500);
      res.json(err);
      return;
    }
    if (!user) {
      // Store error to cookie and redirect
      res.status(401);
      res.json(info);
      return;
    }
    req.login(user, (error) => {
      if (error) {
        // Store error to cookie and redirect
        res.status(500);
        res.json(error);
        return;
      }
      if (user.signedUp) res.redirect('/login');
      else res.redirect('/signup');
      return;
    });
  })(req, res, next);
});

/**
 * @api {post} /session/:method Sign in using the auth method /wo redirection
 * @apiParam (Parameter) {String} method The method to use.
 * @apiParam (Body) {String} [username] The username. Only used in local method.
 * @apiParam (Body) {String} [password] The password. Only used in local method.
 * @apiGroup Session
 * @apiName SignIn
 * @apiDescription Sign in using the auth method.
 *
 *   The auth method shouldn't use redirection in order to use, or it will
 *   return 405 Method Not Allowed.
 *   If the auth method is disabled, it will return 403 Forbidden.
 *   If the user has already signed in, this will register the auth method to
 *   the user. But if the user already has the auth method, this will return
 *   403 Forbidden.
 *   Otherwise, this will try to sign in.
 *
 *   If signing in succeeds, this will return current user.
 *   If signing in fails, this will return 401 Unauthorized.
 *
 * @apiErrorExample {json} If auth method doesn't use redirection:
 *   HTTP/1.1 405 Method Not Allowed
 *   {
 *     "id": "AUTH_REDIRECTION_USE_GET",
 *     "message": "This authentication method uses redirection.
 *               Please use GET request instead."
 *   }
 * @apiErrorExample {json} If user has signed in and has the auth method:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_METHOD_ALREADY_EXISTS",
 *     "message": "You already have this authentication method. You'll need to
 *               unregister current method in order to register new one."
 *   }
 * @apiErrorExample {json} If signing in fails due to wrong username:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_INVALID_USERNAME",
 *     "message": "Invalid username."
 *   }
 * @apiErrorExample {json} If signing in fails due to wrong password:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_INVALID_PASSWORD",
 *     "message": "Invalid password."
 *   }
 * @apiErrorExample {json} If signing in fails because user has been disabled:
 *   HTTP/1.1 401 Forbidden
 *   {
 *     "id": "AUTH_DISABLED_USER",
 *     "message": "User has been disabled. Please contact the administrator."
 *   }
 * @apiErrorExample {json} If auth method is disabled:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_METHOD_DISABLED",
 *     "message": "The authentication method is disabled."
 *   }
 */
router.post('/session/:method', validateAuthRequest, (req, res, next) => {
  passport.authenticate(req.params.method, (err, user, info) => {
    if (err) {
      res.status(500);
      res.json(err);
      return;
    }
    if (!user) {
      res.status(401);
      res.json(info);
      return;
    }
    req.login(user, (error) => {
      if (error) {
        res.status(500);
        res.json(error);
        return;
      }
      res.json(user);
      return;
    });
  })(req, res, next);
});

/**
 * @api {delete} /session/:method Delete the auth method
 * @apiParam (Parameter) {String} method The method to use.
 * @apiGroup Session
 * @apiName DeleteAuthMethod
 * @apiDescription Deletes the registered authentication method.
 *
 *   This can be only issued by signed in users, otherwise this will return
 *   401 Not Authorized.
 *
 *   This can't be executed if there is only one auth method available, and
 *   the user is trying to delete the auth method. If that happens, the server
 *   will return 403 Forbidden.
 *
 *   If the auth method is not available, this will return 404 Not Found.
 *   If the action succeeds, this will return 200 OK.
 * @apiSuccessExample {json} If the action is successful:
 *   HTTP/1.1 200 OK
 *   {}
 * @apiErrorExample {json} If user hasn't signed in:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_NOT_SIGNED_IN",
 *     "message": "Not signed in"
 *   }
 * @apiErrorExample {json} If auth method is not registered:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "id": "AUTH_METHOD_NOT_FOUND",
 *     "message": "Specified authentication method is not found."
 *   }
 * @apiErrorExample {json} If only one auth method is left:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_METHOD_CANNOT_DELETE_PRIMARY",
 *     "message": "You cannot delete your primary authentication method."
 *   }
 */
router.delete('/session/:method', authRequired, (req, res) => {
  const { method } = req.params;
  req.user.getPassports()
  .then(passports => {
    if (passports.length <= 1) {
      // No auth methods will be available if we do this.
      res.status(403);
      res.json({
        id: 'AUTH_METHOD_CANNOT_DELETE_PRIMARY',
        message: 'You cannot delete your primary authentication method.'
      });
      return;
    }
    // Otherwise, just delete them.
    // TODO check for AUTH_METHOD_NOT_FOUND. :/
    return Passport.destroy({
      where: {
        type: method,
        userId: req.user.id
      }
    })
    .then(() => {
      res.send({});
    })
  });
});

/**
 * @api {post} /session/local/register Create an account using local method
 * @apiParam (Body) {String} username The username to use.
 * @apiParam (Body) {String} password The password to use.
 * @apiParam (Body) {String} email The email address to use.
 * @apiGroup Session
 * @apiName CreateAccountLocal
 * @apiDescription Create an account using local method.
 *
 *   If the user has already signed in, this will register the auth method to
 *   the user. But if the user already has the auth method, this will return
 *   403 Forbidden.
 *   Otherwise, this will try to create an account.
 *
 *   If already signed user tries to register, username SHOULD match user's
 *   username. Otherwise, this will return 400 Bad Request.
 *
 *   If username or email conflicts, this will return 409 Conflict.
 *   If password doesn't match the policy, this will return 400 Bad Request.
 *   If creating an account succeeds, this will return current user.
 *
 * @apiErrorExample {json} If user has signed in and has the auth method:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_METHOD_ALREADY_EXISTS",
 *     "message": "You already have this authentication method. You'll need to
 *               unregister current method in order to register new one."
 *   }
 * @apiErrorExample {json} If username is different than signed in one:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "id": "AUTH_USERNAME_DIFFERENT",
 *     "message": "Username should be same as current user."
 *   }
 * @apiErrorExample {json} If username conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "id": "AUTH_USERNAME_EXISTS",
 *     "message": "Username is already in use."
 *   }
 * @apiErrorExample {json} If email conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "id": "AUTH_EMAIL_EXISTS",
 *     "message": "Email address is already in use."
 *   }
 * @apiErrorExample {json} If password doesn't match the policy:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "id": "AUTH_PASSWORD_POLICY",
 *     "message": "Password should be longer than 6 characters."
 *   }
 */
router.post('/session/local/register', (req, res) => {
  register(req, req.body, (err) => {
    if (err && err.code) {
      res.status(err.code);
      res.send(err);
      return;
    }
    if (err) {
      res.status(500);
      res.send(err.message);
      return;
    }
    res.send(req.user);
  });
});

/**
 * @api {post} /session/local/password Send a password-change verify mail
 * @apiGroup Session
 * @apiName PasswordLostLocal
 * @apiParam (Body) {String} email The email address.
 * @apiDescription Sends a password-change verification mail to the user.
 *
 *   This can't be called more than once in 10 minutes. If this is called
 *   before 10 minutes pass, this will return 503 Service Unavailable.
 *
 *   If the email can't be found, this will return 403 Forbidden.
 *   If sending mail succeeds, this will return 200 OK.
 *
 * @apiErrorExample {json} If the email can't be found:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_INVALID_EMAIL",
 *     "message": "Invalid email address."
 *   }
 * @apiErrorExample {json} If cool time hasn't passed yet:
 *   HTTP/1.1 503 Service Unavailable
 *   {
 *     "id": "AUTH_COOLDOWN",
 *     "message": "Please try again later."
 *   }
 */
router.post('/session/local/password', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {put} /session/local Change the password of the user
 * @apiGroup Session
 * @apiName PasswordChangeLocal
 * @apiParam (Body) {String} oldPassword The old password.
 * @apiPassword (Body) {String} password The new password to use.
 * @apiDescription Changes the password of the user.
 *
 *   This requires the user to be signed in. Otherwise, it'll return
 *   401 Unauthorized.
 *
 *   If oldPassword doesn't match the current password of the user,
 *   it'll return 401 Unauthorized.
 *
 *   If password doesn't match the policy, it will return 400 Bad Request.
 *   If changing the password succeeds, it'll return 200 OK.
 *
 * @apiErrorExample {json} If user hasn't signed in:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_NOT_SIGNED_IN",
 *     "message": "Not signed in"
 *   }
 * @apiErrorExample {json} If oldPassword doesn't match:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_INVALID_PASSWORD",
 *     "message": "Invalid password."
 *   }
 * @apiErrorExample {json} If password doesn't match the policy:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "id": "AUTH_PASSWORD_POLICY",
 *     "message": "Password should be longer than 6 characters."
 *   }
 */
router.put('/session/local/', authRequired, (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {delete} /session/ Sign out from current user
 * @apiGroup Session
 * @apiName SignOut
 * @apiDescription Performs sign out and remove credentials information
 *   from the cookie.
 *
 *   This will return 401 Unauthorized if user hasn't signed in.
 *   Otherwise, it'll always return 200 OK.
 *
 * @apiSuccessExample {json} If sign out was successful:
 *   HTTP/1.1 200 OK
 *   {}
 * @apiErrorExample {json} If user hasn't signed in:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "id": "AUTH_NOT_SIGNED_IN",
 *     "message": "Not signed in"
 *   }
 */
router.delete('/session/', authRequired, (req, res) => {
  req.logout();
  res.send({});
});
