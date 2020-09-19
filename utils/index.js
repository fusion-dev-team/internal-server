const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const isObject = item => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

exports.mergeDeep = mergeDeep;

/**
 * email sender transport
 */
exports.transporter = nodemailer.createTransport({
  service: config.mail.service,
  tls: true,
  auth: {
    user: config.mail.serviceEmail,
    pass: config.mail.servicePassword
  }
});

/**
 * create new token for user
 * @param user - user model instance
 */
exports.createTokensPairResponse = (userId) => {
  const result = {
    accessToken: jwt.sign({ userId }, config.common.jwtSecret, {
      expiresIn: config.common.accessTokenExpiresIn
    }),
    refreshToken: jwt.sign({ userId }, config.common.jwtSecret, {
      expiresIn: config.common.refreshTokenExpiresIn
    })
  };
  return result;
};

exports.hash = {
  generate(password) {
    return crypto
      .createHmac(config.common.hashType, config.common.hashKey)
      .update(password)
      .digest('hex');
  },
  compare(rawPassword, hashedPassword) {
    return this.generate(rawPassword) === hashedPassword;
  }
};

exports.parseStringToArray = (string) => {
  if (!string) {
    return [];
  }
  return string.split(',');
};
