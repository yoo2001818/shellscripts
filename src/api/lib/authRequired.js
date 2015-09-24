export default function authRequired(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401);
    res.json({
      id: 'AUTH_NOT_SIGNED_IN',
      message: 'Not signed in'
    });
  }
}
