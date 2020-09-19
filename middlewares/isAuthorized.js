const jwt = require('jsonwebtoken');
const db = require('../db/models/index');
const config = require('../config/index');

module.exports = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.cookies.accessToken) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Authorization token is missing!'
          }
        ]
      });
    }

    const token = req.cookies.accessToken;
    const decoded = jwt.verify(token, config.common.jwtSecret);

    const user = await db.user.findOne({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Token is broken'
          }
        ]
      });
    }
    if (user.status === 'disabled') {
      return res.status(403).json({
        errors: [
          {
            msg: 'You have no permission to get this'
          }
        ]
      });
    }
    req.user = user.toJSON();
    next();
  } catch (err) {
    return res.status(401).json({
      errors: [
        {
          msg: err.message
        }
      ]
    });
  }
};
