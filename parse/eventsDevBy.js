import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths } from './helpers';


const URL = 'https://events.dev.by';

const results = []
let pagesCount;


const q = tress((url, callback) => {

  axios.get(url)
    .then(data => {
      const $ = cheerio.load(data.data);

      // if main page
      if (url === 'https://events.dev.by') {
        // console.log('main url', url);
        pagesCount = $('.body-events .item').length;
        $('.body-events .item').each((item, i) => {
          const link = $(i).find('a.title').attr('href');
          q.push(`${URL}${link}`);
        });
        callback();
        return;
      }

      // if event's page
      // console.log('parsing', url);

      const page = '.show-events';

      const title = $(page).find('h1').text();
      const html = $(page).find('.bl').html();
      const originalLink = url.split(`${URL}`)[1];

      const dateBlock = $(page).find('.time').text();

      const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
      const { day, month, hour } = parsedDate;
      let year = moment().format('YYYY');
      const date = Date.parse(moment(new Date(year, month - 1, day, hour || '')).locale('ru'));

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        source: 'events.dev.by',
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
}

const init = () => {
  q.push(URL);
}

export default { init };
