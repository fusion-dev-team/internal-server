const db = require('../models');

module.exports = {
  findOne: (options = {}) => db.userToken.findOne({
    include: [],
    ...options
  }),
  findByDeviceOrCreate: params => db.userToken.findOrCreate(params),
  resetToken: (payload, query = {}) => db.userToken.update(payload, {
    returning: true,
    ...query
  })
};
