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

/**
 * @api {post} /user/ Update the profile
 * @apiGroup User
 * @apiName SetUserProfile
 * @apiParam (Body) {String} [email] The email address.
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
  res.sendStatus(501);
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
    console.log(req.file);
    const finishedFile = `uploads/user_${req.selUser.id}.png`;
    let { x, y, size } = req.body;
    // Convert x, y, size to integer.
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    size = parseInt(size, 10);
    // First, we check if the file is an image.
    if (file == null) return reject('no image');
    if (!file.mimetype.startsWith('image/')) return reject('not image');
    // Check the dimensions...
    if (isNaN(x) || isNaN(y) || isNaN(size)) return reject('size invalid');
    if (x < 0 || y < 0 || size <= 0) return reject('size invalid');
    // Crop / resize the image.
    gm(file.path)
    .autoOrient()
    .crop(size, size, x, y)
    .resize(256, 256, '!')
    .noProfile()
    .write(finishedFile, (err) => {
      if (err) return reject(err);
      resolve(finishedFile);
    });
  })
  .then((path) => {
    // Upload the file to static server, etc
    // TODO Set the profile image
    res.json(path);
  }, (err) => {
    res.status(400);
    res.json(err);
  })
  .then(() => {
    // Delete the uploaded file.
    if (file && file.path) fs.unlink(file.path);
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
    where.username = {
      $like: username
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
      ['username', 'ASC']
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
