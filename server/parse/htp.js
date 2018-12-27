import tress from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths, formatDate, checkText } from './helpers';

const URL = 'http://www.park.by/cat-38/';

let results = [];
let pagesCount;

const q = tress((url, callback) => {
  axios
    .get(url)
    .then(data => {
      const $ = cheerio.load(data.data);

      // q.push('https://events.dev.by?page=4');
      // if main page
      // if (url.split('.by')[1][0] !== '/') {
      if (url === 'http://www.park.by/cat-38/') {
        console.log('main url', url);
        pagesCount = $('.posts_list .intro2').length;
        $('.posts_list .intro2').each((item, i) => {
          const link = $(i)
            .find('a')
            .attr('href');
          q.push(`http://www.park.by${link}`);
        });
        callback();
        return;
      }

      // if event's page
      console.log('parsing', url);

      const page = '.column2';

      const title = $(page)
        .find('.content_title h1')
        .text()
        .trim();
      const html = $(page)
        .find('.post_content')
        .html();
      const originalLink = url.split(`${URL}`)[1];

      const dateBlock = $(page)
        .find('.time')
        .text();

      const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
      // console.log(parsedDate);
      // console.log(new Date());
      const { day, month, hour, minute } = parsedDate;
      let year = moment().format('YYYY');
      const date = formatDate(year, month, day, hour, minute);
      // console.log(new Date(date));

      // if ($(page).find('.adress-events-map'))

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        source: 'events.dev.by',
        status: checkText(html) ? 'active' : 'active',
      });

      callback();
    })
    .catch(error => {
      callback();
      // console.log(error);
    });
}, 5);

q.drain = () => {
  console.log('pages count', pagesCount);
  console.log('results length', results.length);
  saveEventItemToDB(results);
  results = [];
  if (pagesCount === results.length) {
    // console.log(results);
  } else {
    console.log('some error happened');
  }
};

const init = () => {
  q.push(URL);
};

export default { init };
