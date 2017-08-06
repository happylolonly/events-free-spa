import axios from 'axios';
import cheerio from 'cheerio';

import { saveEventItemToDB } from './helpers';

import moment from 'moment';


import tress  from 'tress';


const URL = 'http://sport.mts.by/master-klassy/minsk/';
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



            // console.log($('.body-events').text());

            // if($('#block-system-main .view-content h1 a').text().trim()){
            // results.push({
            //     title: $('h1').text(),
            //     date: $('.b_infopost>.date').text(),
            //     href: url,
            //     size: $('.newsbody').text().length
            // });

            // const { date, title, time, link, originalLink, originalLinkTitle } = item;

            $('.tabs-general .events__item').each((item, i) => {
              // console.log(item, i);

              const date = $(i).find('.events__item-top .date').text().split(',');
              const day = date[0].split(' ')[0];
              const month = moment().month(date[0].split(' ')[1]).format('MM');
              const time = $(i).find('.events__item-top .time').text();

              const fullDate = `2017-${month}-${day}T${time}`;
              const finalDate = Date.parse(moment(fullDate));

              results.push({
                date: finalDate,
                title: $(i).find('.events__item__title span').text(),
                originalLink: $(i).attr('href').slice(1),
                source: 'sport.mts.by',
              });

            })
        // });
        callback(); //вызываем callback в конце
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


// добавляем в очередь ссылку на первую страницу списка
const init = () => {
  q.push(URL);
}

const parseEvent = (data, item) => {
  return new Promise((resolve) => {
    var $ = cheerio.load(data.data);
    const html = $('.page-content').html();

    const obj = {
      title: item.title,
      text: html,
      date: item.date,
      images: [],
    }

    console.log(obj);

    resolve(obj);
  })

}

export default {
  init,
  parseEvent,
};
