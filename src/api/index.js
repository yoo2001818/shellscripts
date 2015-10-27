import Express from 'express';
import registerMiddlewares from './lib/middleware.js';

import session from './session.js';
import user from './user.js';
import tag from './tag.js';
import entry from './entry/index.js';
import tagtype from './tagtype.js';
import lang from './lang.js';

export const router = new Express.Router();
export default router;
registerMiddlewares(router);

router.use(session);
router.use(user);
router.use(tag);
router.use(entry);
router.use(tagtype);
router.use(lang);

router.use((req, res) => {
  res.sendStatus(404);
});
