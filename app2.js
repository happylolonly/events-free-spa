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

var _meetupBy = require('./parse/meetupBy');

var _meetupBy2 = _interopRequireDefault(_meetupBy);

var _eventsDevBy = require('./parse/eventsDevBy');

var _eventsDevBy2 = _interopRequireDefault(_eventsDevBy);

var _imaguru = require('./parse/imaguru');

var _imaguru2 = _interopRequireDefault(_imaguru);

var _vk = require('./parse/vk');

var _vk2 = _interopRequireDefault(_vk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { index } from './routes/index';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = (0, _express2.default)();

const port = process.env.PORT || 3090;

app.listen(port, () => {
  console.log('Server ready on:', port);
});

_fs2.default.writeFileSync('./data.json', '[]');

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/* ' }));

// app.use('/users', index);


app.use(_express2.default.static(__dirname + '/build'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build');
});

app.get('/events', function (req, res) {
  res.json(JSON.parse(_fs2.default.readFileSync('./data.json')));
});

// console.log(meetupBy);
// meetupBy();

_meetupBy2.default.init();
_eventsDevBy2.default.init();
_imaguru2.default.init();
_vk2.default.init();

app.get('/event', function (req, res) {
  const id = req.param('id');
  const data = JSON.parse(_fs2.default.readFileSync('./data.json', 'utf8'));

  data.forEach(item => {
    if (item.link == id) {

      const { originalLinkTitle, originalLink } = item;
      let link;
      if (originalLinkTitle === 'imaguru.by') {
        link = originalLink;
      } else if (originalLinkTitle === 'vk.com/minskforfree') {
        link = `https://vk.com/${originalLink}`;
      } else {
        link = `http://${originalLinkTitle}${originalLink}`;
      }
      console.log(link);
      _axios2.default.get(link).then(data => {

        let obj = {};
        if (originalLinkTitle === 'events.dev.by') {
          _eventsDevBy2.default.parseEvent(data, item).then(data => {
            res.send(data);
          });
        }
        if (originalLinkTitle === 'meetup.by') {
          _meetupBy2.default.parseEvent(data, item).then(data => {
            res.send(data);
          });
        }
        if (originalLinkTitle === 'imaguru.by') {
          _imaguru2.default.parseEvent(data, item).then(data => {
            res.send(data);
          });
        }
        if (originalLinkTitle === 'vk.com/minskforfree') {
          _vk2.default.parseEvent(data, item).then(data => {
            res.send(data);
          });
        }
        // res.send(obj);
      }).catch(error => {});
    }
  });
});

// app.get('/event/', function(req, res) {
//   res.sendFile(__dirname + '/build');
//   // next();
// });
