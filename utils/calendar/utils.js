const { calendarGenerator } = require('./calendarGenerator');

const countRestDays = (data) => {
  if (data.dateFrom && data.dateTo) {
    return calendarGenerator.calendar.getWorkdays(data);
  }
  return 0;
};

module.exports = {
  countRestDays
};
