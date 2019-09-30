const _pick = require('lodash/pick');
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const Sequelize = require('sequelize');
const userService = require('../db/services/users');
const utils = require('../utils');
const { updateUserConversationId } = require('../utils/slackBot/usersData');
const {
  USER_FIELDS_ADMIN,
  USER_FIELDS_QUERY_EXCLUDES,
  USER_FIELDS_REGULAR
} = require('../utils/contants');

const { Op } = Sequelize;

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers({
      ...makeQueryObject(req.query),
      attributes: {
        exclude: USER_FIELDS_QUERY_EXCLUDES
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
    const user = await userService.findOneUser({
      where: { id: userId },
      attributes: {
        exclude: USER_FIELDS_QUERY_EXCLUDES
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
    if (req.body.slack_name && req.body.slack_name !== req.user.slack_name) {
      const slack = await updateUserConversationId(req, res);
      if (!slack) {
        throw { status: 400, message: 'Not found slack name' };
      }
    }
    const fieldList = USER_FIELDS_REGULAR;
    if (req.user.role === 'admin') {
      fieldList.push(...USER_FIELDS_ADMIN);
    }
    const payload = _pick(req.body, fieldList);

    payload.repo = utils.parseStringToArray(payload.repo);

    await userService.updateUser(payload, {
      where: {
        [Op.or]: [{ login: req.params.login }, { id: req.params.id }]
      },
      individualHooks: true
    });

    return res.json({
      message: 'User updated'
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = (req, res, next) => {
  try {
    if (!req.file || !req.file.filename) {
      throw { status: 400, message: 'Avatar file if wrong' };
    }
    const avatarPath = `public/uploads/${req.file.filename}`;
    const { id } = req.params;
    let oldPath = '';
    let thumbnailPath = '';
    if (req.user.avatar) {
      oldPath = `public/uploads/${req.user.avatar.split('/').splice(-1, 1)}`;
      thumbnailPath = `${oldPath}_thumbnail`;
    } else {
      thumbnailPath = `${avatarPath}_thumbnail`;
    }

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

    gm(avatarPath)
      .quality(20)
      .write(avatarPath, (err) => {
        if (err) {
          return next(err);
        }
        gm(avatarPath)
          .resize(250, 250)
          .write(`${avatarPath}_thumbnail`, async (error) => {
            if (error) {
              return next(error);
            }
            try {
              await userService.update(
                {
                  avatar: `/${avatarPath}`,
                  avatarThumbnail: `/${avatarPath}_thumbnail`
                },
                {
                  where: { id },
                  individualHooks: true
                }
              );

              return res.json({
                message: 'avatar was updated',
                avatar: `/${avatarPath}`,
                avatarThumbnail: `/${avatarPath}_thumbnail`
              });
            } catch (updateError) {
              next(updateError);
            }
          });
      });
  } catch (error) {
    return next(error);
  }
};

/**
 *
 * @param {object} query - request.query object
 * returns query object for user model
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
  getUser,
  updateAvatar
};
