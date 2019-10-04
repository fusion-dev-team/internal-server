const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { transporter } = require('../utils');
const { USER_FIELDS_TOKEN } = require('../utils/contants');
const userService = require('../db/services/users');
const utils = require('../utils');

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

    const link = `${config.siteAddress}/reset/${token}`;

    const mailOptions = {
      from: config.serviceEmail,
      to: req.body.email,
      subject: 'Restore password',
      html: `<a href=${link}>${link}</a>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(404).send(err.message);
      }
      return res.status(200).send(info);
    });
    return null;
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/reset/{token}:
 *   post:
 *     summary: reset password
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         description: token generated onRestore
 *       - name: reset pass object
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPass:
 *                type: string
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
const passwordReset = async (req, res) => {
  const { token } = req.params;
  // const { newPass } = req.body;
  if (!token) {
    return res
      .status(400)
      .message('Token is missing!')
      .send();
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
      return res.status(404).send('Invalid Token!');
    }
    user.update({
      resetPasswordToken: null
      // password: hash(newPass)
    });
    return res.status(200).send('Password changed successfully!');
  } catch (err) {
    return res.status(404).send(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/sign-in:
 *   post:
 *     summary: Sign in
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
  try {
    const user = await userService.findOneUser({
      where: {
        login: req.body.login
      }
    });
    if (!user) {
      throw { status: 403, message: 'User login wrong' };
    }
    if (!utils.hash.compare(req.body.password, user.password)) {
      throw { status: 403, message: 'Password is wrong' };
    }
    const responsePayload = utils.createTokensPair(user, USER_FIELDS_TOKEN);
    return res.json(responsePayload);
  } catch (err) {
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
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: password have been changed
 */
const singUp = async (req, res, next) => {
  try {
    const userPayload = req.body;

    // eslint-disable-next-line prefer-const
    let [user, created] = await userService.findOrCreate({
      where: {
        $or: [
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

    const responsePayload = utils.createTokensPair(user, USER_FIELDS_TOKEN);
    return res.status(201).json(responsePayload);
  } catch (err) {
    return next(err);
  }
};

/**
 * @swagger
 *
 * /api/auth/token-refresh:
 *   post:
 *     summary: Request token refresh
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
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, config.common.jwtSecret);
    const user = await userService.findOneUser({ where: { id: decoded.id } });
    const responsePayload = utils.createTokensPair(user, USER_FIELDS_TOKEN);
    return res.json(responsePayload);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  // authorize,
  singIn,
  singUp,
  tokenRefresh,
  passwordRestore,
  passwordReset
};
