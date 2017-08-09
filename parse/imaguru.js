import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths } from './helpers';


const URL = 'https://imaguru.by/events/';

const results = [];
let pagesCount;


const q = tress((url, callback) => {
  axios.get(url)
    .then(data => {

      const $ = cheerio.load(data.data);

      // if main page
      if (url === 'https://imaguru.by/events/') {
        // console.log('main url', url);
        pagesCount = $('.events-timetable__list li').length;
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
      const date = Date.parse(moment(new Date(year, month - 1, day, hour || '')).locale('ru'));

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        source: 'imaguru.by',
      });

      callback();
    })
    .catch(error => {
      console.log(error);
    })
}, 5);

q.drain = () => {
  console.log('pages count', pagesCount);
  console.log('results length', results.length);
  if (pagesCount === results.length) {
    saveEventItemToDB(results);
    // console.log(results);
  } else {
    console.log('some error happened');
  }
};

const init = () => {
  q.push(URL);
}

export default { init };
