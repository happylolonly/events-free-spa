import tress  from 'tress';
import cheerio from 'cheerio';

import moment from 'moment';
import axios from 'axios';

import { saveEventItemToDB } from './helpers';

const URL = 'http://meetup.by/';


var results = [];

// `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
var q = tress(function(url, callback){

    //тут мы обрабатываем страницу с адресом url
    axios.get(url).then(function(data){
        // if (err) throw err;

        // здесь делаем парсинг страницы из res.body
            // делаем results.push для данных о новости
            // делаем q.push для ссылок на обработку

            var $ = cheerio.load(data.data);



            // console.log($('#block-system-main .view-content h1 a').text());

            // if($('#block-system-main .view-content h1 a').text().trim()){
            // results.push({
            //     title: $('h1').text(),
            //     date: $('.b_infopost>.date').text(),
            //     href: url,
            //     size: $('.newsbody').text().length
            // });
            // const { date, title, time, link, originalLink, originalLinkTitle } = item;
            if ($('#block-system-main .views-row')) {
              handleEventsParse('#block-system-main .views-row', data.data);
              callback();
            }

            // if ($('.block-main .field')) {
            //   handleEventDetailParse('.block-main .field', data.data);
            //   callback();
            // }
            // })

        // callback(); //вызываем callback в конце/
      })
      .catch(error => {
        console.log(error.data);
      })
        // }

            // fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));

    });
// });

// эта функция выполнится, когда в очереди закончатся ссылки
q.drain = function() {
  saveEventItemToDB(results);
}

const handleEventsParse = (selector, document) => {
  // console.log('called');
  var $ = cheerio.load(document);
  $(selector).each((item, i) => {
    // console.log(item, i);

    const dat =  $(i).find('.date-display-single').text();
    // console.log(moment)
    const month = moment().month(dat.split('.')[1] - 1).format('MM');

    let time = '00:00';

    const date = Date.parse(`2017-${month}-${dat.split('.')[0]}`);
    // console.log(Date.parse(`2017-${month}-${date.split('.')[0]}T${time}:00`));

    // console.log(date);

    // console.log('title',$(i).find('a').text());

    const link = $(i).find('a').attr('href');

    q.push(link);

    results.push({
      date,
      title: $(i).find('a').text(),

      originalLink: link,
      source: 'meetup.by',
    });
  });
}

// const handleEventDetailParse = (document) => {
//   var $ = cheerio.load(document);
//   let html = ''
//   $('.block-main .field').each((item, i) => {
//     html += $(i).html();
//   })
//
//   // console.log(html);
//
//   const obj = {
//     title: item.title,
//     text: html,
//     date: item.date,
//     images: [],
//   }
// }

const init = () => {
  q.push(URL);
}

const parseEvent = (data, item) => {
  return new Promise((resolve) => {
    var $ = cheerio.load(data.data);
    let html = ''
    $('.block-main .field').each((item, i) => {
      html += $(i).html();
    })

    // console.log(html);

    const obj = {
      title: item.title,
      text: html,
      date: item.date,
      images: [],
    }

    resolve(obj);
  })

}

export default {
  init,
  parseEvent,
};
