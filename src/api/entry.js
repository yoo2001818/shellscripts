import Express from 'express';
import { User } from '../db/index.js';
import authRequired from './lib/authRequired.js';
import adminRequired from './lib/adminRequired.js';

export const router = new Express.Router();
export default router;

const mockupData = [
  {
    id: 1,
    name: 'Reinstall GRUB',
    title: 'reinstallgrub',
    author: {
      id: 2,
      username: 'yoo2001818',
      login: 'yoo2001818',
      email: 'test@example.com',
      signedUp: true,
      isAdmin: true,
      name: '끼로',
      bio: '안녕하세요 끼로입니다\n와와 잘된다',
      photo: '/uploads/user_2_photo.png?version=1444062538641',
      website: 'http://kkiro.kr/'
    },
    tags: [
      {
        id: 1,
        name: 'bootloader',
        description: 'Bootloader related stuff',
        type: {
          id: 1,
          name: 'program'
        }
      }
    ],
    brief: 'Reinstalls GRUB bootloader. Only supports x86 Linux.',
    type: 'script'
  }
];

/**
 * @api {get} /entries/ Get entries list
 * @apiGroup Entry
 * @apiName SearchEntries
 * @apiParam (Query) {String} [name] The entries' name to search
 * @apiParam (Query) {String} [tags] The entries' tags to search
 * @apiParam (Query) {String} [username] The entries' username to search
 * @apiParam (Query) {String} [type] The entries' type
 * @apiParam (Query) {Integer} [lastIndex] The last entry's ID you've seen
 * @apiDescription Returns entries matching the criteria, or lists all entries
 *   if no criteria was given.
 *
 *   Entries' name are searched using 'LIKE' query.
 *
 *   Pagination is done with 'lastIndex'. Send last entry index you've seen
 *   and this will send entries starting from there.
 */
router.get('/entries/', (req, res) => {
  // Respond with mockup data
  res.json(mockupData);
});

// /entries/:author router
export const authorRouter = new Express.Router();

router.use('/entries/:author', (req, res, next) => {
  // Inject author and continue....
  // This is copied from user.js's /users/:username. Should merge them :P

  // Retrieve the user
  const { author } = req.params;
  if (author == null) {
    // This can't happen
    res.sendStatus(500);
    return;
  }
  User.findOne({
    where: { login: author.toLowerCase() }
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
}, authorRouter);

/**
 * @api {get} /entries/:author Get entries list of user
 * @apiGroup Entry
 * @apiName SearchEntriesByAuthor
 * @apiParam (Parameter) {String} author The author to search
 * @apiParam (Query) {Integer} [lastIndex] The last entry's ID you've seen
 * @apiDescription Returns a list of entries written by the user.
 *
 *   Pagination is done with 'lastIndex'. Send last entry index you've seen
 *   and this will send entries starting from there.
 */
authorRouter.get('/', (req, res) => {
  // Also mockup
  res.json(mockupData);
});

export const entryRouter = new Express.Router();

authorRouter.use('/:name', (req, res, next) => {
  // Inject entry to request
  req.selEntry = mockupData[0];
  next();
}, entryRouter);

/**
 * @api {get} /entries/:author/:name Get specified entry
 * @apiGroup Entry
 * @apiName GetEntryByName
 * @apiParam (Parameter) {String} author The author of the entry
 * @apiParam (Parameter) {String} name The name of the entry
 * @apiDescription Returns the entry.
 */
entryRouter.get('/', (req, res) => {
  // Also mockup
  res.json(mockupData[0]);
});

/**
 * @api {post} /entries/:author/:name Create an entry
 * @apiGroup Entry
 * @apiName CreateEntry
 * @apiParam (Parameter) {String} author The author of the entry
 * @apiParam (Parameter) {String} name The name of the entry
 * @apiDescription Returns the created entry.
 */
entryRouter.post('/', authRequired, adminRequired, (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {put} /entries/:author/:name Create an entry
 * @apiGroup Entry
 * @apiName EditEntry
 * @apiParam (Parameter) {String} author The author of the entry
 * @apiParam (Parameter) {String} name The name of the entry
 * @apiDescription Returns the edited entry.
 */
entryRouter.put('/', authRequired, adminRequired, (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {post} /entries/:author/:name Delete an entry
 * @apiGroup Entry
 * @apiName DeleteEntry
 * @apiParam (Parameter) {String} author The author of the entry
 * @apiParam (Parameter) {String} name The name of the entry
 * @apiDescription Returns 200 OK.
 */
entryRouter.delete('/', authRequired, adminRequired, (req, res) => {
  res.sendStatus(501);
});
