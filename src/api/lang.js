import Express from 'express';

export const router = new Express.Router();
export default router;

router.get('/lang', (req, res) => {
  let lang = req.acceptsLanguages('ko', 'en') || 'en';
  if (req.session && req.session.lang) lang = req.session.lang;
  res.json(lang);
});

router.post('/lang', (req, res) => {
  if (!req.body || !req.body.lang) {
    res.status(500);
    res.json('en');
    return;
  }
  // Save to session and end
  req.session.lang = req.body.lang.toString();
  req.session.save(() => {
    res.json(req.body.lang);
    return;
  });
});
