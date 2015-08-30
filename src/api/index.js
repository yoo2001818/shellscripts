import Express from 'express';
import registerMiddlewares from './lib/middleware.js';

export let router = new Express.Router();

registerMiddlewares(router);

router.all('/session', (req, res) => {
  res.send({test: 'hello'});
});

router.use((req, res) => {
  res.sendStatus(404);
});

export default router;
