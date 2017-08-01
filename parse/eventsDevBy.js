import axios from 'axios';
import cheerio from 'cheerio';

import Event from '../model/event';


import fs from 'fs';
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
q.drain = function(){
    // fs.appendFile('./data.json', JSON.stringify(results, null, 4));
    // var configFile = fs.readFileSync('./data.json');
    // var config = JSON.parse(configFile);
    // config.push(results);
    // // var configJSON = JSON.stringify(config);
    // fs.writeFileSync('./data.json', config);
    //
    // console.log(config);

    console.log(results);



    results.forEach(item => {
      const event = new Event(item);

      // console.log(item);

      event.save()
        .then(() => {
          console.log('saved');
        })
        .catch(error => {
          console.log(error);
        })
    })

    // var configFile = fs.readFileSync('./data.json');
    // var config = configFile.length === 2 ? [] : JSON.parse(configFile);
    // config.push(...results);
    // var configJSON = JSON.stringify(config, null, 4);
    // fs.writeFileSync('./data.json', configJSON);
}

// добавляем в очередь ссылку на первую страницу списка
// q.push(URL);



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
