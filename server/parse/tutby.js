import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths, formatDate, checkText } from './helpers';
import Log from '../model/log';



const URL = 'https://afisha.tut.by/free-events';

const results = []
let pagesCount;
let requestsCount = 0;


const q = tress((url, callback) => {

  axios.get(url)
    .then(data => {
      requestsCount += 1;
      const $ = cheerio.load(data.data);


      // q.push('https://events.dev.by?page=4');
      // if main page
      // if (url.split('.by')[1][0] !== '/') {
      if (url === URL) {
        console.log('main url', url);
        const eventItem = 'body .lists__li';
        pagesCount = $(eventItem).length;
        console.log(pagesCount);
        $(eventItem).each((item, i) => {
          const link = $(i).find('a').attr('href');
          // if (item > 5) return;
          q.push(link);
        });
        callback();
        return;
      }



      // if event's page
      console.log('parsing', url);

      const $page = $('body');

      const $html = $page.find('#event-description');

      $html.find('.b-page-share').remove();
      $html.find('script').remove();
      $html.find('p.note').remove();
      $html.find('div.b-prmplace-media').remove();

      const html = $html.html();



      const title = $page.find('.post_wrapper h1').text();
      const originalLink = url.split('afisha.tut.by')[1];

      let date = $page.find('time')[0].attribs.datetime;
      date = Date.parse(date);

      const image = $page.find('.post_wrapper .main_image').attr('src');

      // const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
      // console.log(parsedDate);
      // console.log(new Date());
      // const { day, month, hour, minute } = parsedDate;
      // let year = moment().format('YYYY');
      // const date = formatDate(year, month, day, hour, minute);
      // console.log(new Date(date));

      const location = $page.find('.post_wrapper .b-event_where .b-event_address').text();

      // if ($(page).find('.adress-events-map'))

      results.push({
        date: date,
        title: title,
        text: html,
        originalLink,
        source: 'afisha.tut.by',
        status: 'active',
        images: [image],
        location: location,
        // contacts: contacts,
      });

      callback();
    })
    .catch(error => {
      console.log(error);
    })
}, 1);

q.drain = () => {
  console.log('pages count', pagesCount);
  console.log('results length', results.length);

  const log = new Log({ date: moment().format('DD/MM/YYYY hh:mm'), data: {
    source: 'tutby',
    pagesCount,
    resultsLength: results.length,
    results: results.map((item) => item.title),
    requestsCount,
  } });

  log.save()
    .then(() => {
      console.log('log saved');
    })
    .catch(error => {
      console.log(error);

      // тупо но вдруг
      const log2 = new Log({ date: moment().format('DD/MM/YYYY hh:mm'), data: {
        error
      } });

      log2.save();

    })

  saveEventItemToDB(results);
  if (pagesCount === results.length) {
    // console.log(results);
  } else {
    console.log('some error happened');
  }
}

const init = () => {
  q.push(URL);
}

export default { init };
