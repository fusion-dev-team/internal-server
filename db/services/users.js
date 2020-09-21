// import * as bcrypt from 'bcryptjs';
const db = require('../models');

module.exports = {
  findAllUsers: (options = {}) => db.user.findAll({
    include: [
      // {
      //   model: Project,
      //   as: 'projects',
      //   attributes: ['id', 'title', 'description'],
      //   through: {
      //     attributes: []
      //   }
      // },
      // {
      //   model: Plan,
      //   as: 'plan',
      //   attributes: ['id', 'title', 'description']
      // }
    ],
    attributes: {
      exclude: ['encryptedPassword', 'createdAt', 'updatedAt']
    },
    ...options
  }),
  findOrCreate: params => db.user.findOrCreate(params),
  create: params => db.user.create(params),
  findOneUser: (query = {}) => db.user.findOne({
    include: [
      // {
      //   model: Project,
      //   as: 'projects',
      //   attributes: ['id', 'title', 'description'],
      //   through: {
      //     attributes: []
      //   }
      // },
      // {
      //   model: Plan,
      //   as: 'plan',
      //   attributes: {
      //     exclude: ['createdAt', 'updatedAt']
      //   },
      //   include: [
      //     {
      //       model: Task,
      //       as: 'tasks',
      //       attributes: {
      //         exclude: ['createdAt', 'updatedAt']
      //       },
      //       through: {
      //         as: 'taskInfo',
      //         attributes: {
      //           exclude: ['plan_id', 'task_id', 'createdAt', 'updatedAt']
      //         }
      //       }
      //     }
      //   ]
      // }
    ],
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
