import Express from 'express';
import registerMiddlewares from './lib/middleware.js';
import { User } from '../db/index.js';

import session from './session.js';
import user from './user.js';
import tag from './tag.js';
import script from './script.js';
import tagtype from './tagtype.js';

export const router = new Express.Router();
export default router;
registerMiddlewares(router);

router.use(session);
router.use(user);
router.use(tag);
router.use(script);
router.use(tagtype);

router.get('/search', (req, res) => {
  res.send({});
});
router.post('/user/username', (req, res) => {
  const { username } = req.body;
  if (username === '') {
    res.send(false);
    return;
  }
  User.findOne({
    where: { username }
  })
  .then(result => {
    res.send(result == null);
  });
});
router.use((req, res) => {
  res.sendStatus(404);
});
