const moment = require('moment');
const { countRestDays } = require('../utils/calendar/utils');
const requestService = require('../db/services/requests');

const postRequest = async (req, res, next) => {
  try {
    const payload = req.body;

    let id;
    if (payload.from) {
      // eslint-disable-next-line prefer-destructuring
      id = payload.from.id;
    }

    payload.authorId = req.user.id;

    if (req.user.role === 'admin' && id) {
      payload.authorId = id;
      payload.updatedBy = req.user.id;
    }
    delete payload.from;

    payload.dateTo = moment(payload.dateTo).endOf('day');
    if (payload.dateFrom) {
      payload.dateFrom = moment(payload.dateFrom).startOf('day');
    }

    const { type } = payload;

    switch (type) {
      case 'technical':
      case 'common':
      case 'documents':
        payload.restDaysNumber = 0;
        break;
      case 'dayOff':
        payload.restDaysNumber = 1;
        break;
      case 'timeOff':
        // explicity convert to 'dayOff' type
        payload.type = 'dayOff';
        payload.restDaysNumber = 0;
        break;
      case 'medical':
      case 'vacation':
        payload.restDaysNumber = countRestDays(payload);
        break;

      default:
        throw { status: 400, message: 'undefined type' };
    }

    delete payload.date;

    let request = await requestService.create(payload);

    request = await requestService.findByPk(request.id);
    // await notifyAboutNewRequestOrExtra(request);
    return res.status(201).json(request);
  } catch (err) {
    err.payload = { body: req.body };
    next(err);
  }
};

const putRequest = async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
};

const getRequests = async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
};

const getRequestsForUser = async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  postRequest,
  putRequest,
  getRequests,
  getRequestsForUser,
  deleteRequest
};
