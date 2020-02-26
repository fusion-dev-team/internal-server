const db = require('../models');

module.exports = {
  findAllUsers: (options = {}) => db.user.findAll({
    attributes: {
      exclude: ['encryptedPassword', 'createdAt', 'updatedAt']
    },
    ...options
  }),
  findOrCreate: params => db.user.findOrCreate(params),
  findOneUser: (query = {}) => db.user.findOne({
    attributes: {
      exclude: ['encryptedPassword', 'createdAt', 'updatedAt']
    },
    ...query
  }),
  updateUser: (payload, query = {}) => db.user.update(payload, {
    returning: true,
    ...query
  })
};
