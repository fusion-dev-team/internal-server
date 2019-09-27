// import * as bcrypt from 'bcryptjs';
const db = require('../models');
// import Project from '../../models/project';
// import Task from '../../models/task';
// import Plan from './../models/plan';

// export default () => {};

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
  })
};

// export const findOneUser = id => User.findOne({
//   where: { id },
//   include: [
//     {
//       model: Project,
//       as: 'projects',
//       attributes: ['id', 'title', 'description'],
//       through: {
//         attributes: []
//       }
//     },
//     {
//       model: Plan,
//       as: 'plan',
//       attributes: {
//         exclude: ['createdAt', 'updatedAt']
//       },
//       include: [
//         {
//           model: Task,
//           as: 'tasks',
//           attributes: {
//             exclude: ['createdAt', 'updatedAt']
//           },
//           through: {
//             as: 'taskInfo',
//             attributes: {
//               exclude: ['plan_id', 'task_id', 'createdAt', 'updatedAt']
//             }
//           }
//         }
//       ]
//     }
//   ],
//   attributes: {
//     exclude: ['encryptedPassword', 'createdAt', 'updatedAt']
//   }
// });

// export const createUser = async user => User.create(
//   {
//     ...user,
//     encryptedPassword: await hashPassword(user.password)
//   },
//   {
//     include: [
//       {
//         model: Project,
//         as: 'projects'
//       }
//     ]
//   }
// );

// export const updateUser = async (id, user) => User.update(
//   {
//     ...user
//   },
//   {
//     where: { id },
//     returning: true
//   }
// );

// export async function hashPassword(password) {
//   return bcrypt.hash(password, 10);
// }
