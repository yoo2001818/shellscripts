import Express from 'express';
import { User } from '../db/index.js';
import authRequired from './lib/authRequired.js';
import adminRequired from './lib/adminRequired.js';
import upload from './lib/upload.js';
import gm from 'gm';
import fs from 'fs';

function checkModifiable(req, res, next) {
  if (req.selUser !== req.user) {
    adminRequired(req, res, next);
    return;
  }
  next();
}

export const userRouter = new Express.Router();

userRouter.get('/', (req, res) => {
  res.json(req.selUser);
});

userRouter.get('/scripts', (req, res) => {
  // Respond with dummy data
  res.json([
    {
      id: 142857,
      name: 'How to build a website for dummies',
      votes: 314,
      tags: [
        {
          id: 314159,
          name: 'linux',
          type: {
            id: 1004,
            name: 'os'
          }
        }
      ]
    }
  ]);
});

userRouter.get('/collections', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {post} /user/ Update the profile
 * @apiGroup User
 * @apiName SetUserProfile
 * @apiParam (Body) {String} name The name of the user.
 * @apiParam (Body) {String} website The website address.
 * @apiParam (Body) {String} bio The biography of the user.
 * @apiDescription Updates and returns the user profile.
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
 * @apiErrorExample {json} If email conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "id": "AUTH_EMAIL_EXISTS",
 *     "message": "Email address is already in use."
 *   }
 */
userRouter.post('/', checkModifiable, (req, res) => {
  const { name, website, bio } = req.body;
  req.selUser.name = name;
  req.selUser.website = website;
  req.selUser.bio = bio;
  return req.selUser.save()
  .then(() => res.json(req.selUser));
});

/**
 * @api {put} /user/photo Update the profile photo
 * @apiGroup User
 * @apiName SetUserProfile photo
 * @apiParam (Body) {File} photo The photo to set.
 * @apiParam (Body) {Integer} x The X position.
 * @apiParam (Body) {Integer} y The Y position.
 * @apiParam (Body) {Integer} size The size of profile photo.
 * @apiDescription Updates and returns the user profile.
 *
 *   This will fail if user hasn't signed in.
 *
 *   If the photo, X, Y, or size is invalid, This will return 400 Bad Request.
 *
 * @apiSuccessExample {json} If updating the profile was successful:
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
 * @apiErrorExample {json} If photo is invalid:
 *   HTTP/1.1 400
 *   {
 *     "id": "PROFILE_IMAGE_INVALID",
 *     "message": "This is not a valid image file."
 *   }
 * @apiErrorExample {json} If dimensions are invalid:
 *   HTTP/1.1 400
 *   {
 *     "id": "PROFILE_IMAGE_DIMENSION_INVALID",
 *     "message": "Please provide valid image dimensions."
 *   }
 */
userRouter.post('/photo', checkModifiable, upload.single('photo'),
(req, res) => {
  const { file } = req;
  new Promise((resolve, reject) => {
    const finishedFile =
      `uploads/user_${req.selUser.id}_photo.png`;
    let { x, y, size } = req.body;
    // Convert x, y, size to integer.
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    size = parseInt(size, 10);
    // First, we check if the file is an image.
    if (file == null || !file.mimetype.startsWith('image/')) {
      return reject({
        id: 'PROFILE_IMAGE_INVALID',
        message: 'This is not a valid image file.'
      });
    }
    // Check the dimensions...
    if (isNaN(x) || isNaN(y) || isNaN(size) || x < 0 || y < 0 || size <= 0) {
      return reject({
        id: 'PROFILE_IMAGE_DIMENSION_INVALID',
        message: 'Please provide valid image dimensions.'
      });
    }
    // Crop / resize the image.
    gm(file.path)
    .flatten()
    .autoOrient()
    .crop(size, size, x, y)
    .resize(256, 256, '!')
    .noProfile()
    .write(finishedFile, (err) => {
      if (err) {
        return reject({
          id: 'PROFILE_IMAGE_INVALID',
          message: 'This is not a valid image file.'
        });
      }
      resolve(finishedFile);
    });
  })
  .then((path) => {
    // Upload the file to static server, etc
    // Set the profile image for now
    req.selUser.photo = `/${path}?version=${+new Date()}`;
    return req.selUser.save()
    .then(() => res.json(req.selUser));
  }, (err) => {
    res.status(400);
    res.json(err);
  })
  .then(() => {
    // Delete the uploaded file.
    if (file && file.path) fs.unlink(file.path);
  })
  .catch(err => {
    res.status(500);
    res.json(err);
  });
});

/**
 * @api {post} /user/finalize Finalize creating an account
 * @apiGroup User
 * @apiName UserSignUpFinalize
 * @apiParam (Body) {String} [username] The username to use.
 * @apiParam (Body) {String} email The email address to use.
 * @apiDescription Finalizes creating an account.
 *
 *   This will return 403 Forbidden if signing up is already done. If username
 *   is sent but user already have an username or username is not sent and
 *   user doesn't have one, this will return 400 Bad Request.
 *
 *   If username conflicts, this will return 409 Conflict.
 *
 *   If succeeds, this will return user's profile.
 *
 * @apiSuccessExample {json} If updating the profile was successful:
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
 * @apiErrorExample {json} If signing up is already done:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_ALREADY_DONE",
 *     "message": "Finalizing sign up is already done."
 *   }
 * @apiErrorExample {json} If username is sent even though it's not required:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "id": "AUTH_NO_USERNAME",
 *     "message": "You shouldn't send username - it's already set."
 *   }
 * @apiErrorExample {json} If email address is not sent:
 *   HTTP/1.1 403 Forbidden
 *   {
 *     "id": "AUTH_INVALID_EMAIL",
 *     "message": "Invalid email address."
 *   }
 * @apiErrorExample {json} If username is not sent and it's required:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "id": "AUTH_INVALID_USERNAME",
 *     "message": "Invalid username."
 *   }
 * @apiErrorExample {json} If username conflicts:
 *   HTTP/1.1 409 Conflict
 *   {
 *     "id": "AUTH_USERNAME_EXISTS",
 *     "message": "Username is already in use."
 *   }
 */
userRouter.post('/finalize', checkModifiable, (req, res) => {
  // Check whether if user has already signed up
  if (req.selUser.signedUp) {
    res.status(403);
    res.json({
      id: 'AUTH_ALREADY_DONE',
      message: 'Finalizing sign up is already done. You shouldn\'t call it ' +
        'again.'
    });
    return;
  }
  const { username, email } = req.body;
  // Check whether if username should be provided
  if (req.selUser.username == null && username == null) {
    res.status(400);
    res.json({
      id: 'AUTH_INVALID_USERNAME',
      message: 'Invalid username.'
    });
    return;
  }
  if (req.selUser.username != null && username != null) {
    res.status(400);
    res.json({
      id: 'AUTH_NO_USERNAME',
      message: 'You shouldn\'t send username - it\'s already set.'
    });
    return;
  }
  // Server should check if email address is present too, but Sequelize will
  // automatically check it, so I'll leave it like this.
  // TODO Email address check routine?
  if (req.selUser.email == null) {
    res.status(400);
    res.json({
      id: 'AUTH_INVALID_EMAIL',
      message: 'Invalid email address.'
    });
    return;
  }
  // Just try to write the data; Let's see how it goes.
  req.selUser.update({
    signedUp: true,
    username, email
  })
  .then(() => {
    res.json(req.selUser);
  }, err => {
    // TODO Check the error value? I'm pretty lazy to check if username
    // conflicts above here. Sequelize would return an error if it conflicts.
    console.log(err);
    res.status(500);
    res.json(err);
  });
});

userRouter.delete('/', checkModifiable, (req, res) => {
  res.sendStatus(501);
});

export const router = new Express.Router();
export default router;

/**
 * @api {get} /users/ List users matching the criteria
 * @apiGroup User
 * @apiName SearchUsers
 * @apiParam (Query) {String} [username] The username to search.
 * @apiParam (Query) {String} [email] The email address to search.
 * @apiParam (Query) {Integer} [lastIndex] The last user id you've seen
 * @apiDescription Searches users matching the criteria, or lists all
 *   users if no criteria was given.
 *
 *   Username is searched using 'LIKE' query. If you need an exact match,
 *   You should use /users/:username instead.
 *
 *   Pagination is done with 'lastIndex'. Send last user index you've seen
 *   and this will send users starting from there.
 */
router.get('/users/', (req, res) => {
  let { username, email, lastIndex } = req.query;
  const where = {};
  if (username != null) {
    where.login = {
      $like: username.toLowerCase()
    };
  }
  if (email != null) {
    where.email = email;
  }
  lastIndex = parseInt(lastIndex);
  if (!isNaN(lastIndex)) {
    where.id = {
      $lt: lastIndex
    };
  }
  User.findAll({
    where,
    // TODO currently it's hardcoded. should be changed
    limit: 20,
    order: [
      ['id', 'DESC']
    ]
  })
  .then(users => {
    res.json(users);
  });
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
  if (username == null) {
    // This can't happen
    res.sendStatus(500);
    return;
  }
  User.findOne({
    where: { login: username.toLowerCase() }
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
