import Express from 'express';
import registerMiddlewares from './lib/middleware.js';

export let router = new Express.Router();

registerMiddlewares(router);

router.use((req, res) => {
  res.sendStatus(404);
});

export default router;
