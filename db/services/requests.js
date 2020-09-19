const db = require('../models');

module.exports = {
  create: payload => db.request.create(payload),
  findAll: (options = {}) => db.request.findAll({
    include: [{
      model: db.user
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    ...options
  }),
  findOrCreate: params => db.request.findOrCreate(params),
  findByPk: (id, options = {}) => db.request.findByPk(id, {
    include: [{
      model: db.user,
      as: 'createdBy',
      attributes: ['id', 'firstNameRu', 'lastNameRu']
    }, {
      model: db.user,
      as: 'updatedBy',
      attributes: ['id', 'firstNameRu', 'lastNameRu']
    }],
    ...options
  }),
  findOne: (query = {}) => db.request.findOne({
    include: [{
      model: db.user
    }],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    ...query
  }),
  update: (payload, query = {}) => db.request.update(payload, {
    returning: true,
    ...query
  })
};
