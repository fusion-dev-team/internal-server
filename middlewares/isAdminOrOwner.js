module.exports = (req, res, next) => {
  try {
    if (req.user.role === 'admin' || String(req.user.id) === String(req.params.id)) {
      return next();
    }
    return res.status(403).json({
      message: 'You have no access to do it'
    });
  } catch (err) {
    return res.status(500).json({
      message: `Validation role error: ${err}`
    });
  }
};
