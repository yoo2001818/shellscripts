import Express from 'express';

export const router = new Express.Router();
export default router;

// TODO
router.get('/comments', (req, res) => {
  res.sendStatus(501);
});
