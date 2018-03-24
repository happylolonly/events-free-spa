import VK from 'vk-io';

import axios from 'axios';

import { saveEventItemToDB } from './helpers';

import cheerio from 'cheerio';

import moment from 'moment';


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

              // console.log($(i).find('.events-timetable__time p:nth-child(1)').text());

              let l = moment().month(month.split(' ')[1]).format("MM");
              // let l = moment().month(month.split(' ')[1]).format("HH:MM");

              let full = moment()

              // console.log(Date.parse(`2017-${l}-${month.split(' ')[0]}T${time}:00`));

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
        // console.log(error.data);
      })
        // }

            // fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));

    });
// });

// эта функция выполнится, когда в очереди закончатся ссылки
q.drain = function(){


}

// добавляем в очередь ссылку на первую страницу списка


const init = () => {
  // q.push(URL);





  vk.auth.server()
  .then((token) => {
      // console.log('Server token:',token);
      vk.setToken('b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38');


      vk.api.wall.search({
          domain: 'free_fitness_minsk',
          query: `${moment().locale('ru').format('MMMM')}`,
          count: 50,
          'access_token': 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
      })
      .then((wall) => {
          // console.log('Wall:',wall);

          let results = [];

          wall.items.forEach((item, i) => {

            const { from_id, id, text } = item;
            const index = text.indexOf(`${moment().locale('ru').format('MMMM')}`);
            // console.log('moment', `${moment().locale('ru').format('MMMM')}`);
            // console.log(index);
            // console.log(moment().locale('ru').format('DD MMMM'));
            // console.log(text);
            if (index >= 0) {
              // console.log('index',index);
              let before = text.substr(index - 2, index - 1);
              if (text.substr(index - 3, index - 2) !== '' && index !== 2) {
                before = text.substr(index - 3, index);
              }
              // console.log('-------');
              // console.log(before);

              if (before.length > 5) {
                return;
              }



              const month = moment().month('август').format("MM");

              const date = Date.parse(`2017-${month}-${before}00:00:00`);

              if (Number.isNaN(date)) return;

              // console.log(date);
              // console.log(moment(date));

              results.push({
                title: item.text.substring(0, 70) + '...',
                originalLink: `?w=wall${from_id}_${id}`,
                date: date,
                source: 'vk.com/free_fitness_minsk',
              });

            }

            // console.log(`minskforfree?w=wall${from_id}_${id}`);

            // console.log(`${moment().format('DD MM')}`);
            // console.log('query', `${moment().locale('ru').format('MMMM')}`);



          });

          saveEventItemToDB(results);
      })
      .catch((error) => {
          // console.error(error);
      });

  })
  .catch((error) => {
      // console.error(error);
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
    // console.log(item);

    // console.log(`-${item[0].originalLink.split('-')[1]}`);

    vk.api.wall.getById({
        posts: `-${item[0].originalLink.split('-')[1]}`,
        'access_token': 'b58844e3b58844e3b58844e34eb5d5cbf8bb588b58844e3ecf6456263d1070e24bb2a38',
    })
    .then((wall) => {
      // console.log(wall)

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
