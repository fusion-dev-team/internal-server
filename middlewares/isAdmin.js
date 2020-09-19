module.exports = function isAdmin(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      return res.sendStatus(418);
    }
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
