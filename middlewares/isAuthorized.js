const jwt = require('jsonwebtoken');
const db = require('../models/index');
const config = require('../config/index');

module.exports = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Authorization header is empty!' });
    }

    const token = req.headers.authorization.split('Bearer ')[1];
    const decoded = jwt.verify(token, config.common.jwtSecret);

    const user = await db.user.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ message: 'Token is broken' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'You have no permission to see this' });
    }
    req.user = user.toJSON();
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
