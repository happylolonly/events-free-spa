import axios from 'axios';
import cheerio from 'cheerio';

import { saveEventItemToDB } from './helpers';

import tress  from 'tress';


const URL = 'https://events.dev.by/';
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

            $('.body-events .item').each((item, i) => {
              // console.log(item, i);

              const date = $(i).find('strong time ').attr('datetime');


              results.push({
                title: $(i).find('.item-body a.title').text(),
                originalLink: $(i).find('.item-body a.title').attr('href'),
                date: new Date(date).getTime(date),
                source: 'events.dev.by',
                // link: Date.now() + item,
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
    const html = $('.body-events .bl').html();

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
