import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';


import axios from 'axios';

import { saveEventItemToDB, convertMonths, formatDate, checkText } from './helpers';


const URL = 'https://imaguru.by/events/';

let results = [];
let pagesCount;


const q = tress((url, callback) => {

  axios.get(url)
    .then(data => {


      const $ = cheerio.load(data.data);

      // if main page
      if (url === URL) {
        // console.log('main url', url);
        pagesCount = $('.events-timetable__list li').length;
        // console.log('pages', pagesCount);
        $('.events-timetable__list li').each((item, i) => {
          const link = $(i).find('a.events-timetable__title').attr('href');
          q.push(`${link}`);
        });
        callback();
        return;
      }

      // if event's page
      // console.log('parsing', url);

      const page = 'main.wrapper';

      const title = $(page).find('h2.event-descr__title').text();
      const html = $(page).find('.event-descr__content').html();
      const originalLink = url.split(`.by`)[1];

      const dateBlock = $(page).find('.event-data__dayOutputWrapper').text();

      const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
      const hour = chrono.parse($(page).find('.event-data__wrapper:nth-of-type(2) > div:first-child').text())[0].start.knownValues.hour;

      const { day, month } = parsedDate;
      let year = moment().format('YYYY');
      const date = formatDate(year, month, day, hour);

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        source: 'imaguru.by',
        status: checkText(html) ? 'active' : 'active',
        images: [],
      });

      callback();
    })
    .catch(error => {
      // console.log(error);
      callback();
    })
}, 5);

q.drain = () => {
  // console.log('pages count', pagesCount);
  // console.log('results length', results.length);
  saveEventItemToDB(results);
  results = [];
  if (pagesCount === results.length) {
    // console.log(results);
  } else {
    // console.log('some error happened');
  }
};

const init = () => {
  q.push(URL);
}

export default { init };
