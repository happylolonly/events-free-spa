import axios from 'axios';
import cheerio from 'cheerio';

import Event from '../model/event';

import moment from 'moment';


import fs from 'fs';
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

              const date1 = $(i).find('.date').text().split(',')[0].split(' ');
              console.log(date1);


              console.log(Date.parse(moment().locale('ru').year('2017').day(+date1[0] + 1).month(date1[1])));

              const date = $(i).find('strong time ').attr('datetime');


              results.push({
                title: $(i).find('.events__item__title span').text(),
                originalLink: $(i).attr('href'),
                date: Date.parse(moment().locale('ru').year('2017').day(+date1[0] + 1).month(date1[1])),
                source: 'sport.mts.by/master-klassy/minsk/',
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

    // console.log(results);

    //   console.log(event);
    //   event.save(function(err, news){
    //     if(err) return console.error("Error while saving data to MongoDB: " + err); // <- this gets executed when there's an error
    //     console.error(news); // <- this never gets logged, even if there's no error.
    //     event.save(news);
    // })(item)


    results.forEach((item, i) => {

      const event = new Event(item);

        event.save(item)
          .then(() => {
            console.log('saved -----------------------------');
          })
          .catch(error => {
            console.log('error');
            console.log(error);
          })


      // setTimeout(() => {
      //   console.log('jkjkjk');
      // }, 1000*i);


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
