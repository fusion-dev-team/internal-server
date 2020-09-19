const { Op, literal } = require('sequelize');
const moment = require('moment');

/**
 * Create range dates for searching relevant requests
 * For dayOff, vacation and medical requests will also
 * take into account the intersection of dates, if the requests
 * enters into the selected range not completely
 * @param {date} fromDate - start date of range
 * @param {date} toDate - end date of range
 */
const createRequestDateRangesFilter = (fromDate, toDate) => {
  if (!fromDate || !toDate) return {};

  const from = moment(fromDate)
    .startOf('day')
    .toISOString();
  const to = moment(toDate)
    .endOf('day')
    .toISOString();

  return {
    [Op.or]: [
      {
        type: { [Op.not]: ['technical', 'common', 'documents'] },
        [Op.and]: literal(`("dateFrom", "dateTo") OVERLAPS ('${from}', '${to}')`)
      },
      {
        type: ['common', 'documents', 'technical'],
        createdAt: { [Op.lte]: to },
        dateTo: { [Op.gte]: from }
      }
    ]
  };
};

module.exports = {
  createRequestDateRangesFilter
};
