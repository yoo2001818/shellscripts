import Express from 'express';
import passport from './lib/passport.js';
import { register } from './lib/auth/local.js';
import strategies from './lib/auth/strategy.js';

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
 *     "errorId": "AUTH_NOT_SIGNED_IN",
 *     "error": "Not signed in"
 *   }
 */
router.get('/session/', (req, res) => {
  res.send(req.user || null);
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
 * @api {get} /session/:method Sign in using the auth method /w redirection
 * @apiParam (Parameter) {String} [method] The method to use.
 * @apiGroup Session
 * @apiName SignInRedirect
 * @apiDescription Sign in using the auth method.
 *
 *   The auth method should use redirection in order to use, or it will return
 *   405 Method Not Allowed.
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
 *     "errorId": "AUTH_REDIRECTION_USE_GET",
 *     "error": "This authentication method doesn't use redirection.
 *               Please use POST request instead."
 *   }
 * @apiErrorExample {json} If user has signed in and has the auth method:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "errorId": "AUTH_METHOD_ALREADY_EXISTS",
 *     "error": "You already have this authentication method. You'll need to
 *               unregister current method in order to register new one."
 *   }
 */
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
 *   If the user has already signed in, this will register the auth method to
 *   the user. But if the user already has the auth method, this will return
 *   403 Forbidden.
 *   Otherwise, this will try to sign in.
 *
 *   If signing in succeeds, this will return current user.
 *   If signing in fails, this will return 401 Unauthorized or 403 Forbidden.
 *
 * @apiErrorExample {json} If auth method doesn't use redirection:
 *   HTTP/1.1 405 Method Not Allowed
 *   {
 *     "errorId": "AUTH_REDIRECTION_USE_GET",
 *     "error": "This authentication method uses redirection.
 *               Please use GET request instead."
 *   }
 * @apiErrorExample {json} If user has signed in and has the auth method:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "errorId": "AUTH_METHOD_ALREADY_EXISTS",
 *     "error": "You already have this authentication method. You'll need to
 *               unregister current method in order to register new one."
 *   }
 * @apiErrorExample {json} If signing in fails due to wrong username:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "errorId": "AUTH_INVALID_USERNAME",
 *     "error": "Invalid username."
 *   }
 * @apiErrorExample {json} If signing in fails due to wrong password:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "errorId": "AUTH_INVALID_PASSWORD",
 *     "error": "Invalid password."
 *   }
 * @apiErrorExample {json} If signing in fails because user has disabled:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "errorId": "AUTH_DISABLED_USER",
 *     "error": "User has been disabled. Please contact the administrator."
 *   }
 */
// TODO Dummy code to avoid error.
export let a = 1;

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
 *   If username or email conflicts, this will return 409 Conflict.
 *   If password doesn't match the policy, this will return 400 Bad Request.
 *   If creating an account succeeds, this will return current user.
 *
 * @apiErrorExample {json} If user has signed in and has the auth method:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "errorId": "AUTH_METHOD_ALREADY_EXISTS",
 *     "error": "You already have this authentication method. You'll need to
 *               unregister current method in order to register new one."
 *   }
 * @apiErrorExample {json} If username conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "errorId": "AUTH_USERNAME_EXISTS",
 *     "error": "Username is already in use."
 *   }
 * @apiErrorExample {json} If email conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "errorId": "AUTH_EMAIL_EXISTS",
 *     "error": "Email address is already in use."
 *   }
 * @apiErrorExample {json} If password doesn't match the policy:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "errorId": "AUTH_PASSWORD_POLICY",
 *     "error": "Password should be longer than 6 characters."
 *   }
 */

router.all('/session/local/register', (req, res) => {
  register(req, req.body, (err) => {
    if (err) return res.status(500).send(err.message);
    res.send(req.user || {});
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
 *   before 10 minutes pass, this will return 403 Forbidden.
 *
 *   If the email can't be found, this will return 400 Bad Request.
 *   If sending mail succeeds, this will return 200 OK.
 *
 * @apiErrorExample {json} If the email can't be found:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "errorId": "AUTH_INVALID_EMAIL",
 *     "error": "Invalid email address."
 *   }
 * @apiErrorExample {json} If cool time hasn't passed yet:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "errorId": "AUTH_COOLDOWN",
 *     "error": "Please try again later."
 *   }
 */
a = 3;

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
 *     "errorId": "AUTH_NOT_SIGNED_IN",
 *     "error": "Not signed in"
 *   }
 * @apiErrorExample {json} If oldPassword doesn't match:
 *   HTTP/1.1 401 Unauthorized
 *   {
 *     "errorId": "AUTH_INVALID_PASSWORD",
 *     "error": "Invalid password."
 *   }
 * @apiErrorExample {json} If password doesn't match the policy:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "errorId": "AUTH_PASSWORD_POLICY",
 *     "error": "Password should be longer than 6 characters."
 *   }
 */
a = 1;

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
 *     "errorId": "AUTH_NOT_SIGNED_IN",
 *     "error": "Not signed in"
 *   }
 */
router.delete('/session/', (req, res) => {
  req.logout();
  res.send({});
});
