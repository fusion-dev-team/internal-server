const db = require('../models');

const { Op } = db.Sequelize;

const getUsers = async (req, res, next) => {
  try {
    const users = await db.user.findAll({
      ...makeQueryObject(req.query),
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt']
      }
    });
    return res.json({ users });
  } catch (err) {
    next(err);
  }
};

const editUser = async (req, res, next) => {
  try {
    return res.json({});
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} query - request.query object
 */
const makeQueryObject = (query) => {
  const queryObject = {
    where: {}
  };
  if (query.name) {
    const namePattern = { [Op.iLike]: `%${query.name}%` };
    queryObject.where[Op.or] = [
      { login: namePattern },
      { firstName: namePattern },
      { lastName: namePattern }
    ];
  }
  if (query.notRole) {
    queryObject.where.role = { [Op.not]: query.notRole };
  }
  if (query.status) {
    queryObject.where.status = query.status;
  }
  if (query.sort) {
    queryObject.order = JSON.parse(query.sort);
  }

  if (query.limit) {
    queryObject.limit = query.limit;
  }
  return queryObject;
};
module.exports = {
  getUsers,
  editUser
};
