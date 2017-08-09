import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths } from './helpers';

const URL = 'http://sport.mts.by/master-klassy/minsk';

const results = [];
let pagesCount;


const q = tress((url, callback) => {

  axios.get(url)
    .then(data => {
        const $ = cheerio.load(data.data);

        // if main page
        if (url === 'http://sport.mts.by/master-klassy/minsk') {
          // console.log('main url', url);
          pagesCount = $('.page-container .tabs-general .events-list a').length;
          $('.page-container .tabs-general .events-list a').each((item, i) => {
            const link = $(i).attr('href');
            q.push(`http://sport.mts.by${link}`);
          });
          callback();
          return;
        }



        // if event's page
        // console.log('parsing', url);

        const page = '.wrapper';

        const title = $(page).find('.page-container h2').text();
        const html = $(page).find('.page-content').html();
        const originalLink = url.split(`.by`)[1];

        const dateBlock = $(page).find('.event-info__date').text();

        const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
        console.log(originalLink);
        console.log(parsedDate);
        const { day, month, hour } = parsedDate;
        let year = moment().format('YYYY');
        const date = Date.parse(moment(new Date(year, month - 1, day, hour || '')).locale('ru'));

        results.push({
          date: date,
          title: title,
          text: html,
          originalLink,
          source: 'sport.mts.by',
        });

        callback();
    })
    .catch(error => {
      console.log(error.data);
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
