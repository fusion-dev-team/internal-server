module.exports = (req, res, next) => {
  try {
    if (req.user.role === 'admin' || String(req.user.id) === String(req.params.id)) {
      return next();
    }
    return res.status(403).json({
      errors: [
        {
          msg: 'You have no access to do it'
        }
      ]
    });
  } catch (err) {
    return res.status(500).json({
      errors: [
        {
          msg: `Validation role error: ${err}`
        }
      ]
    });
  }
};
