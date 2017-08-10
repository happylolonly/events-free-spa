import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths } from './helpers';


const URL = 'http://meetup.by';

const results = [];
let pagesCount;


const q = tress((url, callback) => {
  // console.log('ready', url);
  // console.log('q', q.length());
  axios.get(url)
    .then(data => {
      const $ = cheerio.load(data.data);

      // if main page
      if (url === 'http://meetup.by') {
        // console.log('main url', url);
        pagesCount = $('.region-content-inner .views-row').length;
        $('.region-content-inner .views-row').each((item, i) => {
          const link = $(i).find('a').attr('href');
          q.push(`${URL}${link}`);
        });
        callback();
        return;
      }

      // if event's page
      // console.log('parsing', url);

      const page = '#region-content';

      const title = $(page).find('#page-title').text();
      const html = $(page).find('article .content').html();
      const originalLink = url.split(`${URL}`)[1];

      const dateBlock = $(page).find('.date-display-single').text();

      let parsedDate;

      if (dateBlock) {
        const date =  $(page).find('.date-display-single').text();
        parsedDate = chrono.parse(convertMonths(date))[0].start.knownValues;
      } else {
        const date = $(page).find('.date-display-start').text();
        parsedDate = chrono.parse(convertMonths(date))[0].start.knownValues;
      }

      const { day, month, year, hour, minute } = parsedDate;
      // console.log(parsedDate);
      const date = Date.parse(moment(new Date(year, month - 1, day, hour, minute)).locale('ru'));

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        source: 'meetup.by',
      });

      callback();
    })
    .catch(error => {
      console.log(error);
    })
}, 5)

q.drain = () => {
  console.log('pages count', pagesCount);
  console.log('results length', results.length);
  if (pagesCount === results.length) {
    saveEventItemToDB(results);
    // console.log(results);
  } else {
    console.log('some error happened');
  }
}

const init = () => {
  q.push(URL);
}

export default { init };
