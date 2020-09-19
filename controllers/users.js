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

// swager pizdit !!!
/**
 * @swagger
 * definitions:
 *   UserModel:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       login:
 *         type: string
 *       info:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       DoB:
 *         type: string
 *         format: date-time
 *       phone:
 *         type: string
 *       slack_name:
 *         type: string
 *       slack_conversational_id:
 *         type: string
 *       slack_conversational_crm_id:
 *         type: string
 *       role:
 *         type: string
 *         enum: ['student', 'user', 'sales', 'admin']
 *       repo:
 *         type: string
 *       resetPasswordExpires:
 *         type: string
 *         format: date-time
 *       resetPasswordToken:
 *         type: string
 *       status:
 *         type: string
 *         enum: ['registered', 'active', 'disabled']
 */

/**
 * @swagger
 * definitions:
 *   UserPutModel:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       info:
 *         type: string
 *       email:
 *         type: string
 *         required: true
 *       DoB:
 *         type: string
 *         format: date-time
 *       phone:
 *         type: string
 *       slack_name:
 *         type: string
 *       role:
 *         type: string
 *         enum: ['student', 'user', 'sales', 'admin']
 *         description: only for admin
 *       repo:
 *         type: string
 *       status:
 *         type: string
 *         enum: ['registered', 'active', 'disabled']
 *         description: only for admin
 */

/**
 * @swagger
 *
 * /api/users/:
 *   get:
 *     summary: GET users lsit
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Alexey"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: "active"
 *       - in: query
 *         name: notRole
 *         schema:
 *           type: string
 *           example: "student"
 *           description: excluding item with this role
 *       - in: query
 *         name: sort
 *         schema:
 *           type: array
 *           items:
 *             type: "string"
 *           description: sorting parameters
 *           example: ["id", "ASC"]
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: Filtered and ordered list of users
 *       500:
 *         description: Error message. Probably invalid request data
 *
 */
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
    next({ text: err.message, filename: __dirname, payload: req.query });
  }
};

/**
 * @swagger
 *
 * /api/users/{id}:
 *   get:
 *     summary: GET user by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: user id
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: user
 */
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

/**
 * @swagger
 *
 * /api/users/{id}:
 *   put:
 *     summary: edit user record
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UserPutModel'
 *     tags:
 *      - users
 *     responses:
 *       200:
 *         description: user updated
 *       500:
 *         description: error message
 *
 */
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
        [Op.or]: [{ login: req.params.id }, { id: req.params.id }]
      },
      individualHooks: true
    });

    return res.json({
      message: 'User updated'
    });
  } catch (error) {
    error.payload = req.body;
    next(error);
  }
};

/**
 * @swagger
 *
 * /api/users/{id}/avatar/:
 *   put:
 *     summary: Update user avatar
 *     parameters:
 *      - in: path
 *        name: id
 *        description: user id
 *        schema:
 *          type: number
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: file
 *           encoding:
 *             avatar:
 *               contentType: image/png, image/jpeg
 *       description: new project object
 *     tags:
 *       - users
 *     responses:
 *       200:
 *         description: project created
 *       500:
 *         description: err message. probably invalid request body
 */
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
              await userService.updateUser(
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
                message: 'Avatar was updated',
                avatar: `/${avatarPath}`,
                avatarThumbnail: `/${avatarPath}_thumbnail`
              });
            } catch (updateError) {
              updateError.payload = {
                file: req.file,
                avatarPath
              };
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
    if (typeof query.sort === 'string') {
      queryObject.order = [JSON.parse(query.sort)];
    } else if (Array.isArray(query.sort)) {
      queryObject.order = [query.sort];
    }
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
