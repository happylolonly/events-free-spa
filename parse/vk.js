import VK from 'vk-io';

import axios from 'axios';

import Event from '../model/event';

import cheerio from 'cheerio';

import moment from 'moment';


import fs from 'fs';
import tress  from 'tress';




// vk.setOptions({
//     app: 111,
//     login: 'protagonist@valtec.com',
//     pass: 'luckyVaultBoy',
//     phone: '+749531116869'
// });



const vk = new VK({
  app: 6131483,
  key: 'f4vLOjoPyKSOw4qXgb6y',
  scope: 'all',
  token: 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
});




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

              console.log($(i).find('.events-timetable__time p:nth-child(1)').text());

              let l = moment().month(month.split(' ')[1]).format("MM");
              // let l = moment().month(month.split(' ')[1]).format("HH:MM");

              let full = moment()

              console.log(Date.parse(`2017-${l}-${month.split(' ')[0]}T${time}:00`));

              results.push({
                title: $(i).find('a.events-timetable__title').text(),
                originalLink: $(i).find('a.events-timetable__title').attr('href'),
                date: $(i).find('.date-display-single').text(),
                originalLinkTitle: 'imaguru.by',
                link: Date.now() + item,
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
    var configFile = fs.readFileSync('./data.json');
    var config = configFile.length === 2 ? [] : JSON.parse(configFile);
    config.push(...results);
    var configJSON = JSON.stringify(config, null, 4);
    fs.writeFileSync('./data.json', configJSON);
}

// добавляем в очередь ссылку на первую страницу списка


const init = () => {
  // q.push(URL);





  vk.auth.server()
  .then((token) => {
      console.log('Server token:',token);
      vk.setToken('b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38');


      vk.api.wall.search({
          domain: 'minskforfree',
          query: `${moment().locale('ru').format('MMMM')}`,
          count: 10,
          'access_token': 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
      })
      .then((wall) => {
          // console.log('Wall:',wall);

          let results = [];

          wall.items.forEach((item, i) => {

            const { from_id, id, text } = item;
            const index = text.indexOf(`${moment().locale('ru').format('MMMM')}`);
            if (index > 0) {
              const before = text.substr(index - 2, index);
              console.log('before');
              console.log(before);
            }

            // console.log(`minskforfree?w=wall${from_id}_${id}`);

            // console.log(`${moment().format('DD MM')}`);
            // console.log('query', `${moment().locale('ru').format('MMMM')}`);

            results.push({
              title: item.text.substring(0, 50) + '...',
              originalLink: `?w=wall${from_id}_${id}`,
              date: `${moment().format('DD MM')}`,
              source: 'vk.com/minskforfree',
            });

          });

          // console.log(results);

          // results.forEach(item => {
          //   const event = new Event(item);
          //
          //   event.save()
          //     .then(() => {
          //       console.log('saved');
          //     })
          //     .catch(error => {
          //       console.log(error);
          //     })
          // })


          // var configFile = fs.readFileSync('./data.json');
          // var config = configFile.length === 2 ? [] : JSON.parse(configFile);
          // config.push(...results);
          // var configJSON = JSON.stringify(config, null, 4);
          // fs.writeFileSync('./data.json', configJSON);
      })
      .catch((error) => {
          console.error(error);
      });

  })
  .catch((error) => {
      console.error(error);
  });


}

const parseEvent = (data, item) => {
  // var $ = cheerio.load(data.data);
  // let html = ''
  // $('.block-main .field').each((item, i) => {
  //   html += $(i).html();
  // })

  // console.log(data.data);

  return new Promise((resolve) => {
    console.log(item);

    console.log(`-${item.originalLink.split('-')[1]}`);

    vk.api.wall.getById({
        posts: `-${item.originalLink.split('-')[1]}`,
        'access_token': 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
    })
    .then((wall) => {
      console.log(wall)

      const obj = {
        title: item.title,
        text: wall[0].text,
        date: item.date,
        images: [],
      }

      resolve(obj);
    })

    // const html = $('#wl_post_body_wrap').html();

    // console.log(html);





  })


}

export default {
  init,
  parseEvent,
};
