module.exports = (req, res, next) => {
  try {
    if (req.user.status === 'active') {
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
          msg: `Validation status error: ${err}`
        }
      ]
    });
  }
};
