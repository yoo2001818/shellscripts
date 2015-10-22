import Express from 'express';

export const router = new Express.Router();
export default router;

/**
 * @api {get} /entries/:author/:name/comments Get a list of comments
 * @apiGroup Entry/Comment
 * @apiName EntryCommentList
 * @apiUse EntryGet
 * @apiParam (Query) {Integer} [lastIndex] The last comment's ID you've seen
 * @apiDescription Returns a list of comments of the entry.
 *
 *   Pagination is done with 'lastIndex'. Send last comment index you've seen
 *   and this will send comments starting from there.
 */
router.get('/comments', (req, res) => {
  res.sendStatus(501);
});

router.post('/comments', (req, res) => {
  res.sendStatus(501);
});

router.get('/comments/:id', (req, res) => {
  res.sendStatus(501);
});

router.put('/comments/:id', (req, res) => {
  res.sendStatus(501);
});

router.delete('/comments/:id', (req, res) => {
  res.sendStatus(501);
});
