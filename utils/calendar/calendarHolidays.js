const cheerio = require('cheerio');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const config = require('../../config');

/**
 * Create calendar file in file system
 * file will contain days list where each day will be marked as working or holiday
 * depends on official calenday of holidays
 */
class Calendar {
  constructor(years, filePath = 'calendar.json') {
    this.years = years;
    this.filePath = filePath;
    this.dates = {};
  }

  workdaysCounter(accumulator, currentDate) {
    if (!currentDate.is_holiday) {
      accumulator += 1;
    }
    return accumulator;
  }

  async initCalendar() {
    if (fs.existsSync(this.filePath)) {
      this.dates = JSON.parse(fs.readFileSync(this.filePath));
    }
    await this.writeCalendar();
    console.log('Calendar was initialized');
  }

  async writeCalendar() {
    let isDirty = false;
    for (let index = 0; index < this.years.length; index += 1) {
      const year = this.years[index];
      if (!this.dates.hasOwnProperty(year) || !this.dates[year].length) {
        this.dates[year] = await this.createYear(`${config.externalAPI.calendarSiteUrl}${year}`) || [];
        isDirty = true;
      }
    }
    if (isDirty) this.writeToFile();
  }

  writeToFile() {
    fs.writeFile(this.filePath, JSON.stringify(this.dates), (err) => {
      if (err) return console.error('error', err);
    });
  }

  async createYear(url) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      // select all days elements from calendar
      const datesHtml = $('.ui-datepicker-calendar tbody > tr td > a[data-day]');
      const yearDates = datesHtml.map((i, date) => {
        const day = $(date).attr('data-day').replace('_', '-');
        // class .dtype16474 means working day
        return { day, is_holiday: $(date).hasClass('dtype16475') };
      });
      return Array.from(yearDates);
    } catch (error) {
      console.error('getYear error: ', error.message);
      return [];
    }
  }

  getWorkdays({ dateFrom, dateTo } = {}) {
    const year = moment(dateFrom).get('year');
    const diffStart = moment(dateFrom, 'YYYY-MM-DD').diff(
      moment(this.dates[year][0].day, 'DD-MM-YYYY'),
      'days'
    );
    const diffEnd = Math.ceil(moment(dateTo).endOf('d').diff(moment(dateFrom).startOf('d'), 'h') / 24);
    const days = this.dates[year].slice(diffStart, diffEnd + diffStart);
    return days.reduce(this.workdaysCounter, 0);
  }
}

module.exports = {
  Calendar
};
