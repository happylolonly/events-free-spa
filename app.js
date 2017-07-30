import express from 'express';

import axios from 'axios';
import cheerio from 'cheerio';


import fs from 'fs';
import tress  from 'tress';

import meetupBy from './parse/meetupBy';
import eventsDevBy from './parse/eventsDevBy';
import imaguru from './parse/imaguru';
import vk from './parse/vk';

// import { index } from './routes/index';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const port = process.env.PORT || 3090;

app.listen(port, () => {
  console.log('Server ready on:', port);
});

fs.writeFileSync('./data.json', '[]');


app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/* '}));

// app.use('/users', index);


app.use(express.static(__dirname + '/build'));



app.get('/', function(req, res){
  res.sendFile(__dirname + '/build');
});

app.get('/events', function (req, res) {
  res.json(JSON.parse(fs.readFileSync('./data.json')));
})

// console.log(meetupBy);
// meetupBy();

meetupBy.init();
eventsDevBy.init();
imaguru.init();
vk.init();

app.get('/event', function (req, res) {
  const id = req.param('id');
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));


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
      axios.get(link)

        .then(data => {

          let obj = {};
          if (originalLinkTitle === 'events.dev.by') {
            eventsDevBy.parseEvent(data, item).then((data) => {
              res.send(data);
            })
          }
          if (originalLinkTitle === 'meetup.by') {
            meetupBy.parseEvent(data, item).then((data) => {
              res.send(data);
            })
          }
          if (originalLinkTitle === 'imaguru.by') {
            imaguru.parseEvent(data, item).then((data) => {
              res.send(data);
            })
          }
          if (originalLinkTitle === 'vk.com/minskforfree') {
            vk.parseEvent(data, item).then((data) => {
              res.send(data);
            })
          }
          // res.send(obj);

        })
        .catch(error => {
        })
    }
  })
})

// app.get('/event/', function(req, res) {
//   res.sendFile(__dirname + '/build');
//   // next();
// });
