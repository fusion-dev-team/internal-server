const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config');
// const crypto = require('crypto');
// const _ = require('lodash');
// const db = require('../models/index');
// const hash = require('../utils/hash');
const { transporter } = require('../utils');
const { USER_FIELDS_TOKEN } = require('../utils/contants');
const db = require('../db/models');
const utils = require('../utils');

// const authorize = async (req, res) => {
//   try {
//     const decoded = jwt.verify(req.body.cookie, req.secret);
//     const user = await db.user.findOne({
//       where: { login: decoded.login },
//       attributes: {
//         exclude: ['password', 'updatedAt'],
//       },
//     });
//     if (!user) {
//       return res.status(404).send(false);
//     }
//     return res.status(200).send(user.get());
//   } catch (err) {
//     return res.status(403).send(err);
//   }
// };

const passwordRestore = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: { email: req.body.email.trim() },
      attributes: {
        exclude: ['password', 'updatedAt']
      }
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
    const user = await db.user.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date()
        }
      },
      attributes: {
        exclude: ['password', 'updatedAt']
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

const singIn = async (req, res, next) => {
  try {
    const user = await db.user.findOne({
      where: {
        login: req.body.login
      }
    });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }
    if (!utils.hash.compare(req.body.password, user.password)) {
      throw { status: 401, message: 'Password is wrong' };
    }
    const responsePayload = utils.createTokensPair(user, USER_FIELDS_TOKEN);
    return res.json(responsePayload);
  } catch (err) {
    next(err);
  }
};

const singUp = async (req, res, next) => {
  try {
    const userPayload = req.body;
    userPayload.password = utils.hash.generate(userPayload.password);

    // eslint-disable-next-line prefer-const
    let [user, created] = await db.user.findOrCreate({
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
      default: userPayload
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

const tokenRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, config.common.jwtSecret);
    const user = await db.user.findOne({ where: { id: decoded.id } });
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
