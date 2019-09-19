const _pick = require('lodash/pick');
const db = require('../models');
const utils = require('../utils');
const { updateUserConversationId } = require('../utils/slackBot/usersData');

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

const getUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = await db.user.findOne({
      where: { id: userId },
      attributes: {
        exclude: ['password', 'updatedAt', 'resetPasswordToken', 'resetPasswordExpires']
      }
    });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  try {
    // If slack_name was changed
    if (req.body.slack_name && req.body.slack_name !== req.userData.slack_name) {
      const slack = await updateUserConversationId(req, res);
      if (!slack) {
        throw { status: 400, message: 'Not found slack name' };
      }
    }

    const payload = _pick(req.body, [
      'firstName',
      'lastName',
      'info',
      'email',
      'DoB',
      'phone',
      'slack_name',
      'repo'
    ]);

    payload.repo = utils.parseStringToArray(payload.repo);

    let user = await db.user.update(payload, {
      where: {
        [Op.or]: [{ login: req.params.login }, { id: req.params.id }]
      },
      individualHooks: true
    });

    user = user[1][0];
    user = _pick(user.toJSON(), [
      'firstName',
      'lastName',
      'info',
      'email',
      'DoB',
      'phone',
      'slack_name',
      'repo'
    ]);
    return res.json({
      message: 'User updated',
      user
    });
  } catch (error) {
    next(error);
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
  editUser,
  getUser
};
