import Express from 'express';
import authRequired from './lib/authRequired.js';
import adminRequired from './lib/adminRequired.js';

export const router = new Express.Router();
export default router;

/**
 * @api {get} /tag-types List tag types matching the criteria
 * @apiGroup TagType
 * @apiName SearchTagTypes
 * @apiParam (Query) {String} [name] The tag type's name to search
 * @apiParam (Query) {Integer} [lastIndex] The last tag type's ID you've seen
 * @apiDescription Returns tag types matching the criteria, or lists all tag
 *   types if no criteria was given.
 *
 *   Tag types are searched using 'LIKE' query. If you need an exact match,
 *   You should use /tag-types/:name instead.
 *
 *   Pagination is done with 'lastIndex'. Send last tag type index you've seen
 *   and this will send tag types starting from there.
 */
router.get('/tag-types', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {post} /tag-types Post a new tag type
 * @apiGroup TagType
 * @apiName PostTagType
 * @apiParam (Body) {String} name The tag type's name
 * @apiParam (Body) {String} [description] The tag type's description
 * @apiDescription Posts a new tag type.
 *
 *   This will require an admin privilege. If user isn't admin, this will
 *   return 403 Forbidden.
 */
router.post('/tag-types', authRequired, adminRequired, (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {get} /tag-types/:name Get a tag type with the name
 * @apiGroup TagType
 * @apiName GetTagType
 * @apiParam (Parameter) {String} name The tag type's name
 */
router.get('/tag-types/:name', (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {put} /tag-types/:name Modify tag type's data
 * @apiGroup TagType
 * @apiName ModifyTagType
 * @apiParam (Parameter) {String} name The tag type's name
 * @apiParam (Body) {String} [description] The tag type's description
 * @apiDescription Modifies tag type's data.
 *
 *   This will require an admin privilege. If user isn't admin, this will
 *   return 403 Forbidden.
 */
router.put('/tag-types/:name', authRequired, adminRequired, (req, res) => {
  res.sendStatus(501);
});

/**
 * @api {delete} /tag-types/:name Delete tag type
 * @apiGroup TagType
 * @apiName DeleteTagType
 * @apiParam (Parameter) {String} name The tag type's name
 * @apiDescription Deletes the tag type.
 *
 *   This will require an admin privilege. If user isn't admin, this will
 *   return 403 Forbidden.
 */
router.delete('/tag-types/:name', authRequired, adminRequired, (req, res) => {
  res.sendStatus(501);
});
