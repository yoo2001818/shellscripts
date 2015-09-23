import Express from 'express';
import { isInt, matches } from 'validator';
import { Tag } from '../db/index.js';
import authRequired from './lib/authRequired.js';

export const router = new Express.Router();
export default router;

/**
 * @api {get} /tag/ Get tag list
 * @apiGroup Tag
 * @apiName GetTag
 */
router.get('/', (req, res) => {
  Tag.findAll()
  .then(data => {
    res.send(data);
  });
});

/**
 * @api {post} /tag/ Post a new tag
 * @apiGroup Tag
 * @apiName PostTag
 *
 * @apiParam (Body) {String} name
 * @apiParam (Body) {String} description
 * @apiParam (Body) {Integer} type
 */
router.post('/', authRequired, (req, res) => {
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
