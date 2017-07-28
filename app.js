import express from 'express';

import axios from 'axios';
import cheerio from 'cheerio';

import fs from 'fs';
import tress  from 'tress';

// import { index } from './routes/index';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();


app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/* '}));

// app.use('/users', index);


app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/build');
});

app.get('/events', function (req, res) {
  res.json(JSON.parse(fs.readFileSync('./data.json', 'utf8')));
})

app.get('/event', function (req, res) {
  const id = req.param('id');

  const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));


  data.forEach(item => {
    if (item.link == id) {

      const { originalLinkTitle, originalLink } = item;
      console.log(`${originalLinkTitle}${originalLink}`);
      axios.get(`http://${originalLinkTitle}${originalLink}`)

        .then(data => {

          var $ = cheerio.load(data.data);
          const html = $('.node.node-event.node-published').text();

          const obj = {
            title: item.title,
            text: html,
            date: item.date,
            images: [],
          }

          res.send(obj);

        })
        .catch(error => {
        })
    }
  })
})


const port = process.env.PORT || 3090;
app.listen(port, () => {
  console.log('Server ready on:', port);
});

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



            console.log($('#block-system-main .view-content h1 a').text());

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


              results.push({
                title: $(i).find('a').text(),
                originalLink: $(i).find('a').attr('href'),
                date: $(i).find('.date-display-single').text(),
                originalLinkTitle: 'meetup.by',
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
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
}

// добавляем в очередь ссылку на первую страницу списка
q.push(URL);
