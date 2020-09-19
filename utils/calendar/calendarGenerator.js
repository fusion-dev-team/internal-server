const moment = require('moment');
const { Calendar } = require('./calendarHolidays');

/**
 * Create calendar
 */
class CalendarGenerator {
  constructor(years = this.getDefaultYears()) {
    this.years = years;
  }

  getDefaultYears() {
    const currentYear = moment().get('year');
    return [currentYear - 1, currentYear, currentYear + 1];
  }

  async initCalendar() {
    this.calendar = new Calendar(this.years);
    await this.calendar.initCalendar();
  }
}

const calendarGenerator = new CalendarGenerator();

module.exports = {
  calendarGenerator
};
