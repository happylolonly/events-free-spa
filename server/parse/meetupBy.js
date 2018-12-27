import tress from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import axios from 'axios';

import { saveEventItemToDB, convertMonths, formatDate, checkText } from './helpers';

import logger from '../helpers/logger';

const URL = 'http://meetup.by';

let results = [];
let pagesCount;
let requestsCount = 0;

const q = tress((url, callback) => {
  // console.log('ready', url);
  // console.log('q', q.length());
  axios
    .get(url)
    .then(data => {
      requestsCount += 1;
      const $ = cheerio.load(data.data);

      // if main page
      if (url === 'http://meetup.by') {
        // console.log('main url', url);
        pagesCount = $('.region-content-inner #block-system-main .views-row').length;
        $('.region-content-inner #block-system-main .views-row').each((item, i) => {
          const link = $(i)
            .find('a')
            .attr('href');
          q.push(`${URL}${link}`);
        });
        callback();
        return;
      }

      // if event's page
      // console.log('parsing', url);

      const page = '#region-content';

      const title = $(page)
        .find('#page-title')
        .text();
      const html = $(page)
        .find('article .content')
        .html();
      const originalLink = url.split(`${URL}`)[1];

      const dateBlock = $(page)
        .find('.date-display-single')
        .text();

      let parsedDate;

      if (dateBlock) {
        const date = $(page)
          .find('.date-display-single')
          .text();
        parsedDate = chrono.parse(convertMonths(date))[0].start.knownValues;
      } else {
        const date = $(page)
          .find('.date-display-start')
          .text();
        parsedDate = chrono.parse(convertMonths(date))[0].start.knownValues;
      }

      const { day, month, year, hour, minute } = parsedDate;
      // console.log(parsedDate);
      const date = formatDate(year, month, day, hour, minute);

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        images: [],
        source: 'meetup.by',
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
  // console.log('pages count', pagesCount);
  // console.log('results length', results.length);

  logger.save({
    source: 'meetupBy',
    pagesCount,
    resultsLength: results.length,
    requestsCount,
  });

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
};

export default { init };
