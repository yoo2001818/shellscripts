import Express from 'express';
import { isInt, matches } from 'validator';
import { Tag } from '../db/index.js';
import authRequired from './lib/authRequired.js';

export const router = new Express.Router();
export default router;

/**
 * @api {get} /tags/ Get tag list
 * @apiGroup Tag
 * @apiName SearchTags
 * @apiParam (Query) {String} [name] The tag's name to search
 * @apiParam (Query) {Integer} [lastIndex] The last tag's ID you've seen
 * @apiDescription Returns tags matching the criteria, or lists all tags if
 *   no criteria was given.
 *
 *   Tags are searched using 'LIKE' query. If you need an exact match,
 *   You should use /tags/:name instead.
 *
 *   Pagination is done with 'lastIndex'. Send last tag index you've seen
 *   and this will send tags starting from there.
 */
router.get('/tags/', (req, res) => {
  Tag.findAll()
  .then(data => {
    res.send(data);
  });
});

/**
 * @api {post} /tags/ Post a new tag
 * @apiGroup Tag
 * @apiName PostTag
 * @apiParam (Body) {String} name
 * @apiParam (Body) {String} [description]
 * @apiParam (Body) {Integer} [type]
 * @apiUse AuthRequired
 */
router.post('/tags/', authRequired, (req, res) => {
  const {name, description, type} = req.body;
  if (!isInt(type)) {
    res.status(500).send('Type should be an integer');
    return;
  }
  if (!matches(name, /^[a-zA-Z0-9_]+$/)) {
    res.status(500).send('Name is invalid');
    return;
  }
  Tag.create({
    name, description, type
  })
  .then(data => {
    res.send(data);
  }, err => {
    res.status(500).send(err);
  });
});

/**
 * @api {get} /tags/:name Get the tag with the name
 * @apiGroup Tag
 * @apiName GetTag
 * @apiParam (Parameter) {String} name
 */
router.get('/tags/:name', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {put} /tags/:name Modify the tag with the name
 * @apiGroup Tag
 * @apiName ModifyTag
 * @apiParam (Parameter) {String} name
 * @apiParam (Body) {String} [description]
 * @apiParam (Body) {Integer} [type]
 * @apiUse AuthRequired
 */
router.put('/tags/:name', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {delete} /tags/:name Delete the tag with the name
 * @apiGroup Tag
 * @apiName DeleteTag
 * @apiParam (Parameter) {String} name
 */
router.delete('/tags/:name', (req, res) => {
  res.sendStatus(501);
});
