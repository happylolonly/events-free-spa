import tress  from 'tress';
import cheerio from 'cheerio';

import chrono from 'chrono-node';
import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB, convertMonths, formatDate, checkText, formatHTML, detectContact } from './helpers';


const URL = 'https://citydog.by/vedy/';

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

        const $ = cheerio.load(data.data);

        // if main page
        if (url === URL) {
          console.log('main url', url);
          pagesCount = $('.front .vedyMain-item').length;
          console.log(pagesCount);
          $('.front .vedyMain-item').each((item, i) => {
            const link = $(i).find('.vedyMain-itemImg a').attr('href');
            if (link.indexOf('/post/') !== -1) {
              pagesCount -= 1;
              console.log('post');
              return;
            }
            q.push(`${link}`);
          });
          callback();
          return;
        }

        // if event's page
        console.log('parsing', url);
        console.log(q.length());

        const page = 'div.vedyPage-container';

        if($(page).find('.vedyPage-eventInfoWrapper').text().indexOf('бесплатн') === -1) {
          console.log('not free');
          callback();
          return;
        }

        const htmlTitle = $(page).find('.vedyPage-eventInfoWrapper h1').text();
        const title = htmlTitle.substring(0, htmlTitle.indexOf('('));

        // const defaultHTML = $(page);
        // defaultHTML.find('.vedyPage-blockShare').remove();
        const html = $(page).find('.vedyPage-Description-text').html();
        // const html = $(page).find('.afishaPost-Description-text').html();
        const originalLink = url.split(`/vedy`)[1];

        const location = $(page).find('.place .address').text();
        console.log(location);

        const image = $(page).find('.vedyPage-gallery img').attr('src');
        console.log(image);

        let contact2 = {};

        $('.vedyPage-eventInfoWrapper p').each((item, i) => {
          if ($(i).text().toLowerCase().indexOf('справки:') !== -1) {
            const href = $(i).find('a').attr('href');
            contact2 = Object.assign(contact2, detectContact(href));
          }
        });

        console.log(contact2);

        let dateBlock = $(page).find('.vedyPage-eventInfoWrapper h3').text();
        dateBlock = dateBlock.replace('|', '');
        dateBlock = dateBlock.replace('-', '');

        let date;
        let year = moment().format('YYYY');


        dateBlock = dateBlock.split(' ')[0];
        const day = dateBlock.split('.')[0];
        const month = dateBlock.split('.')[1];


        date = formatDate(year, month, day);
        console.log(date);

        // if (dateBlock.indexOf('-') !== -1) {
        //
        // } else if (dateBlock.split(' ')[0].indexOf('.') !== -1) {
        //   const arrSplitted = dateBlock.split(' ')[0];
        //   const day = arrSplitted.split('.')[0];
        //   const month = arrSplitted.split('.')[1];
        //
        //
        //   date = formatDate(year, month, day);
        //   console.log(date);
        // }
        // else {
        //
        //   const parsedDate = chrono.parse(convertMonths(dateBlock))[0].start.knownValues;
        //   // const hour = chrono.parse($(page).find('.event-data__wrapper:nth-of-type(2) > div:first-child').text())[0].start.knownValues.hour;
        //
        //   console.log(parsedDate);
        //   const { day, month, hour } = parsedDate;
        //
        //   date = formatDate(year, month, day, hour);
        // }




        results.push({
          date: date,
          title: title,
          text: formatHTML(html),
          originalLink,
          source: 'citydog.by/vedy',
          status: checkText(html) ? 'active' : 'active',
          location: location,
          contacts: contact2,
          images: [image]
        });

        callback();
      })
      .catch(error => {
        console.log('url failed', url);
        callback();
        console.log(error);
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
