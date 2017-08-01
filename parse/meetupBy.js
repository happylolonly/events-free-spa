import axios from 'axios';
import cheerio from 'cheerio';

import Event from '../model/event';

import moment from 'moment';

import fs from 'fs';
import tress  from 'tress';

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

            $('#block-system-main .views-row').each((item, i) => {
              // console.log(item, i);

              const dat =  $(i).find('.date-display-single').text();
              // console.log(moment)
              const month = moment().month(dat.split('.')[1] - 1).format('MM');

              let time = '00:00';

              const date = Date.parse(`2017-${month}-${dat.split('.')[0]}`);
              // console.log(Date.parse(`2017-${month}-${date.split('.')[0]}T${time}:00`));

              // console.log(date);


              results.push({
                date,
                title: $(i).find('a').text(),

                originalLink: $(i).find('a').attr('href'),
                source: 'meetup.by',
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

    results.forEach(item => {
      const event = new Event(item);

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
