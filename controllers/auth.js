const moment = require('moment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const _omit = require('lodash.omit');
const { Op } = require('sequelize');
const config = require('../config');
const { transporter } = require('../utils');
const { USER_FIELDS_QUERY_EXCLUDES } = require('../utils/contants');
const userService = require('../db/services/users');
const tokenService = require('../db/services/tokens');
const utils = require('../utils');
const logger = require('../utils/logger');

/**
 * @swagger
 *
 * /api/auth/password-restore:
 *   post:
 *     summary: Request password restore
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: email have been sent to the email
 *       404:
 *         description: error no such user
 *       403:
 *         description: Error message, probably wrong request
 */
const passwordRestore = async (req, res, next) => {
  try {
    const user = await userService.findOneUser({
      where: { email: req.body.email.trim() }
    });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    const buf = crypto.randomBytes(20);
    const token = buf.toString('hex');
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: moment().add(10, 'minutes')
    });

    const link = `${config.common.siteAddress}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: config.serviceEmail,
      to: req.body.email,
      subject: 'Restore password',
      html: `<a href=${link}>${link}</a>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logger.error({ text: `Sign-up error: ${err.message}`, routeName: req.originalUrl, payload: req.body });
        return res.status(500).json({
          errors: [{
            msg: `Could not send confirmation email to user: ${err.message}`
          }]
        });
      }
      return res.status(200).json({ message: info });
    });
  } catch (err) {
    err.payload = req.body;
    return next(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/reset/:
 *   post:
 *     summary: reset password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               token:
 *                 type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 *       400:
 *         description: no token
 *       404:
 *         description: err message. Probably no such user
 */
const passwordReset = async (req, res, next) => {
  const { token, password } = req.body;
  if (!token) {
    return res.status(400).json({
      errors: [{
        msg: 'Token is missing!'
      }]
    });
  }
  try {
    const user = await userService.findOneUser({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date()
        }
      }
    });
    if (!user) {
      return res.status(404).json({
        errors: [{
          msg: 'Invalid Token!'
        }]
      });
    }
    await user.update({
      resetPasswordToken: null,
      password: utils.hash.generate(password)
    });
    return res.status(200).json({ message: 'Password changed successfully!' });
  } catch (err) {
    err.payload = { token, password };
    next(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/me:
 *   post:
 *     summary: Get user by token
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: return user object
 *       500:
 *         description: errors
 */
const getUserByToken = (req, res, next) => {
  try {
    let { user } = req;
    user = _omit(user, USER_FIELDS_QUERY_EXCLUDES);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 *
 * /api/auth/sign-in:
 *   post:
 *     summary: Sign in
 *     parameters:
 *      - in: header
 *        name: device
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 *       500:
 *         description: validation errors
 */
const singIn = async (req, res, next) => {
  const { device } = req.headers;
  try {
    let user = await userService.findOneUser({
      where: {
        [Op.or]: [{
          login: req.body.login
        }, {
          email: req.body.login
        }]
      }
    });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    if (!utils.hash.compare(req.body.password, user.password)) {
      throw { status: 401, message: 'Password is wrong' };
    }

    user = user.toJSON();
    user = _omit(user, USER_FIELDS_QUERY_EXCLUDES);

    const { accessToken, refreshToken } = utils.createTokensPairResponse(user.id);
    const [result, created] = await tokenService.findByDeviceOrCreate({
      where: {
        device
      },
      defaults: {
        device,
        access: accessToken,
        refresh: refreshToken,
        userId: user.id
      }
    });

    if (!created) {
      result.access = accessToken;
      result.refresh = refreshToken;
      await result.save();
    }

    return res.status(200)
      .cookie('accessToken', accessToken, { maxAge: config.common.accessTokenExpiresInMS })
      .cookie('refreshToken', refreshToken, { maxAge: config.common.refreshTokenExpiresInMS })
      .json({ user });
  } catch (err) {
    err.payload = {
      body: req.body,
      headers: device
    };
    next(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/sign-up:
 *   post:
 *     summary: register
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: device
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                type: string
 *               login:
 *                type: string
 *               password:
 *                type: string
 *               device:
 *                type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 */
const singUp = async (req, res, next) => {
  const userPayload = req.body;
  const { device } = req.headers;

  try {
    // eslint-disable-next-line prefer-const
    let [user, created] = await userService.findOrCreate({
      where: {
        [Op.or]: [
          {
            login: userPayload.login
          },
          {
            email: userPayload.email
          }
        ]
      },
      defaults: userPayload
    });
    if (!created) {
      throw { message: 'User with same credentials already exists', status: 400 };
    }
    user = user.toJSON();
    user = _omit(user, USER_FIELDS_QUERY_EXCLUDES);

    const { accessToken, refreshToken } = utils.createTokensPairResponse(user.id);
    const [result, recordCreated] = await tokenService.findByDeviceOrCreate({
      where: {
        device
      },
      defaults: {
        device,
        access: accessToken,
        refresh: refreshToken,
        userId: user.id
      }
    });

    if (!recordCreated) {
      result.access = accessToken;
      result.refresh = refreshToken;
      await result.save();
    }
    return res.status(201)
      .cookie('accessToken', accessToken, { maxAge: config.common.accessTokenExpiresInMS })
      .cookie('refreshToken', refreshToken, { maxAge: config.common.refreshTokenExpiresInMS })
      .json({ user });
  } catch (err) {
    err.payload = {
      body: req.body,
      headers: device
    };
    return next(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/token-refresh:
 *   post:
 *     summary: Request token refresh
 *     parameters:
 *      - in: header
 *        name: device
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                type: string
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: email have been sent to the email
 *       404:
 *         description: error no such user
 *       403:
 *         description: Error message, probably wrong request
 */
const tokenRefresh = async (req, res, next) => {
  const { refreshToken: refresh } = req.cookies;
  const { device } = req.headers;

  try {
    const userTokens = await tokenService.findOne({
      where: {
        device,
        refresh
      }
    });

    if (!userTokens) {
      return res.status(404).json({
        errors: [{
          msg: 'There is no such session'
        }]
      });
    }

    jwt.verify(refresh, config.common.jwtSecret);

    const { accessToken, refreshToken } = utils.createTokensPairResponse(userTokens.userId);
    userTokens.access = accessToken;
    userTokens.refresh = refreshToken;
    await userTokens.save();

    return res.status(200)
      .cookie('accessToken', accessToken, { maxAge: config.common.accessTokenExpiresInMS })
      .cookie('refreshToken', refreshToken, { maxAge: config.common.refreshTokenExpiresInMS })
      .json({ message: 'Tokens updated' });
  } catch (error) {
    error.payload = {
      cookies: req.cookies,
      headers: device
    };
    return next(error);
  }
};

const logout = (req, res, next) => {
  try {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json({ message: 'You was logged out' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserByToken,
  singIn,
  singUp,
  tokenRefresh,
  passwordRestore,
  passwordReset,
  logout
};
