import axios from 'axios';
import cheerio from 'cheerio';

import Event from '../model/event';

import moment from 'moment';

import async from 'async';


import fs from 'fs';
import tress  from 'tress';

const URL = 'https://imaguru.by/events/';

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


            $('.events-timetable__list li').each((item, i) => {
              // console.log(item, i);

              // moment().month("July").format("M");
              let month = $(i).find('.events-timetable__time p:nth-child(2)').text();
              let time = $(i).find('.events-timetable__time p:nth-child(1)').text();

              // console.log($(i).find('.events-timetable__time p:nth-child(1)').text());

              let l = moment().month(month.split(' ')[1]).format("MM");
              // let l = moment().month(month.split(' ')[1]).format("HH:MM");

              let full = moment()

              const date = Date.parse(`2017-${l}-${month.split(' ')[0]}T${time}:00`);

              let link = $(i).find('a.events-timetable__title').attr('href');
              // console.log(link.subsrting());

              results.push({
                // date: $(i).find('.date-display-single').text(),
                date,
                title: $(i).find('a.events-timetable__title').text(),

                originalLink: link.substring(19),
                source: 'imaguru.by'
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

    // console.log(results);

    async.each(results, function (item, callback) {
      console.log(item);
      const event = new Event(item);

        event.save()
          .then((data) => {
            console.log('saved');
            console.log(data);
            callback(data);
          })
          .catch(error => {
            console.log(error);
            callback('jkjjl');
          })

    }, function(err) {
    // if any of the file processing produced an error, err would equal that error
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
      console.log(err);
    } else {
      console.log('All files have been processed successfully');
    }
});

    // results.forEach(item => {
    //
    // })
    // var configFile = fs.readFileSync('./data.json');
    // var config = configFile.length === 2 ? [] : JSON.parse(configFile);
    // config.push(...results);
    // var configJSON = JSON.stringify(config, null, 4);
    // fs.writeFileSync('./data.json', configJSON);
}

// добавляем в очередь ссылку на первую страницу списка


const init = () => {
  q.push(URL);
}

const parseEvent = (data, item) => {
  return new Promise((resolve) => {
    var $ = cheerio.load(data.data);
    // let html = ''
    // $('.block-main .field').each((item, i) => {
    //   html += $(i).html();
    // })

    const html = $('.event-descr__content').html();


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
