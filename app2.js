'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tress = require('tress');

var _tress2 = _interopRequireDefault(_tress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { index } from './routes/index';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = (0, _express2.default)();

const port = process.env.PORT || 3090;
app.listen(port, () => {
  console.log('Server ready on:', port);
});

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/* ' }));

// app.use('/users', index);


app.use(_express2.default.static(__dirname + '/build'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build');
});

app.get('/events', function (req, res) {
  res.json(JSON.parse(_fs2.default.readFileSync('./data.json', 'utf8')));
});

app.get('/event', function (req, res) {
  const id = req.param('id');

  const data = JSON.parse(_fs2.default.readFileSync('./data.json', 'utf8'));

  data.forEach(item => {
    if (item.link == id) {

      const { originalLinkTitle, originalLink } = item;
      console.log(`${originalLinkTitle}${originalLink}`);
      _axios2.default.get(`http://${originalLinkTitle}${originalLink}`).then(data => {

        var $ = _cheerio2.default.load(data.data);
        const html = $('.node.node-event.node-published').text();

        const obj = {
          title: item.title,
          text: html,
          date: item.date,
          images: []
        };

        res.send(obj);
      }).catch(error => {});
    }
  });
});

const URL = 'http://meetup.by/';
var results = [];

// `tress` последовательно вызывает наш обработчик для каждой ссылки в очереди
var q = (0, _tress2.default)(function (url, callback) {

  //тут мы обрабатываем страницу с адресом url
  _axios2.default.get(url).then(function (data) {
    // if (err) throw err;

    // здесь делаем парсинг страницы из res.body
    // делаем results.push для данных о новости
    // делаем q.push для ссылок на обработку

    var $ = _cheerio2.default.load(data.data);

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
        link: Date.now() + item
      });
    });
    // });
    callback(); //вызываем callback в конце
  }).catch(error => {
    console.log(error.data);
  });
  // }

  // fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
});
// });

// эта функция выполнится, когда в очереди закончатся ссылки
q.drain = function () {
  _fs2.default.writeFileSync('./data.json', JSON.stringify(results, null, 4));
};

// добавляем в очередь ссылку на первую страницу списка
q.push(URL);
