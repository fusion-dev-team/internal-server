/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const changeCase = require('change-case');
const express = require('express');
const routes = require('require-dir')();

module.exports = (app) => {
  Object.keys(routes).forEach((routeName) => {
    const router = express.Router();

    require(`./${routeName}`)(router);

    app.use(`/api/${changeCase.paramCase(routeName)}`, router);
  });
};
