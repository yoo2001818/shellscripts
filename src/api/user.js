import Express from 'express';
import { User } from '../db/index.js';
import authRequired from './lib/authRequired.js';

export const userRouter = new Express.Router();

userRouter.get('/', (req, res) => {
  res.json(req.selUser);
});

/**
 * @api {put} /user/ Update the profile
 * @apiGroup User
 * @apiName SetUserProfile
 * @apiParam (Body) {String} [email] The email address.
 * @apiDescription Updates and returns the user profile.
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
 * @apiErrorExample {json} If email conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "id": "AUTH_EMAIL_EXISTS",
 *     "message": "Email address is already in use."
 *   }
 */
userRouter.put('/', (req, res) => {
  res.sendStatus(501);
});

userRouter.delete('/', (req, res) => {
  res.sendStatus(501);
});

export const router = new Express.Router();
export default router;

router.get('/users/', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {get} /users/:username Get a user with the username
 * @apiGroup User
 * @apiName GetUser
 * @apiParam (Parameter) {String} username The username.
 * @apiDescription Returns the user object.
 *
 *   This will return 404 Not Found if the user is not found.
 *
 * @apiSuccessExample {json} If the user is found:
 *   HTTP/1.1 200 OK
 *   {
 *     "username": "Username",
 *     "email": "Email"
 *   }
 * @apiErrorExample {json} If the user is not found:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "id": "USER_NOT_FOUND",
 *     "message": "User with given username is not found."
 *   }
 */
router.use('/users/:username', (req, res, next) => {
  // Retrieve the user
  const { username } = req.params;
  User.findOne({
    where: { username }
  })
  .then(user => {
    if (user == null) {
      // Not found
      res.status(404);
      res.json({
        id: 'USER_NOT_FOUND',
        message: 'User with given username is not found.'
      });
      return;
    }
    req.selUser = user;
    next();
  });
}, userRouter);

/**
 * @api {get} /user/ Get current user
 * @apiGroup User
 * @apiName GetCurrentUser
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
router.use('/user/', authRequired, (req, res, next) => {
  req.selUser = req.user;
  next();
}, userRouter);
