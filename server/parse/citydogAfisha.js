import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths, formatDate, checkText, formatHTML } from './helpers';


const URL = 'https://citydog.by/afisha/';

const results = [];
let pagesCount;


var instance = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'}
});


const q = tress((url, callback) => {
  setTimeout(() => { // 1 sec delay for citydog blocks
    instance.get(url)
      .then(data => {
        // console.log(data);

        const $ = cheerio.load(data.data);

        // if main page
        if (url === URL) {
          console.log('main url', url);
          pagesCount = $('.afishaMain-items .afishaMain-item').length;
          console.log(pagesCount);
          $('.afishaMain-items .afishaMain-item').each((item, i) => {
            const link = $(i).find('h3 a').attr('href');
            q.push(`${link}`);
          });
          callback();
          return;
        }

        // if event's page
        console.log('parsing', url);
        console.log(q.length());

        const page = 'div.afishaPage-container';

        if($(page).find('.afishaPost-eventInfoFooter').text().indexOf('бесплатн') === -1) {
          console.log('not free');
          pagesCount -= 1;
          callback();
          return;
        }

        const htmlTitle = $(page).find('.afishaPost-Description h3').text();
        const title = htmlTitle.substring(0, htmlTitle.indexOf('('));

        const html = $(page).find('.afishaPost-Description-text').html();
        const image = $(page).find('.afishaPage-gallery img').attr('src');

        const originalLink = url.split(`/afisha`)[1];

        let dateBlock = $(page).find('.afishaPost-eventInfoHeader h4').text();
        dateBlock = dateBlock.replace('|', '');

        let date;
        let year = moment().format('YYYY');

        if (dateBlock.indexOf('-') !== -1) {
          dateBlock = dateBlock.split('-')[0];
          const day = dateBlock.split('.')[0];
          const month = dateBlock.split('.')[1];


          date = formatDate(year, month, day);
          console.log(date);
        } else {

          const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
          // const hour = chrono.parse($(page).find('.event-data__wrapper:nth-of-type(2) > div:first-child').text())[0].start.knownValues.hour;

          console.log(parsedDate);
          const { day, month, hour } = parsedDate;

          date = formatDate(year, month, day, hour);
        }



        results.push({
          date: date,
          title: title,
          text: formatHTML(html),
          originalLink,
          source: 'citydog.by/afisha',
          status: checkText(html) ? 'active' : 'active',
          images: [image],
          // contacts: contact2,
        });

        callback();
      })
      .catch(error => {
        console.log('url failed', url);
        console.log(error);
        callback();
        // console.log(error);
      })
  }, 2000)
}, 1);

q.drain = () => {
  console.log('pages count', pagesCount);
  console.log('results length', results.length);
  // console.log(results);
  saveEventItemToDB(results);
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
