module.exports = (req, res, next) => {
  try {
    if (req.user.status === 'active') {
      return next();
    }
    return res.status(403).json({
      message: 'You have no access to do it'
    });
  } catch (err) {
    return res.status(500).json({
      message: `Validation status error: ${err}`
    });
  }
};
