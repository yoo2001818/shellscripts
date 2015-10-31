export default function authRequired(req, res, next) {
  if (req.user) {
    if (!req.user.enabled) {
      res.status(403);
      res.json({
        id: 'AUTH_DISABLED_USER',
        message: 'User has been disabled. Please contact the administrator.'
      });
    } else {
      next();
    }
  } else {
    res.status(401);
    res.json({
      id: 'AUTH_NOT_SIGNED_IN',
      message: 'Not signed in'
    });
  }
}
