export default function adminRequired(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    res.json({
      id: 'AUTH_FORBIDDEN',
      message: 'You need admin privilege to run this command.'
    });
  }
}
