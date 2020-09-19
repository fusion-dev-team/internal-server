module.exports = function isSalesOrManager(req, res, next) {
  try {
    if (req.user.role !== 'sales' && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.sendStatus(403);
    }
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
