import express from 'express';
import mongoose from 'mongoose';

import fs from 'fs';

import axios from 'axios';

import Event from './model/event';

import meetupBy from './parse/meetupBy';
import eventsDevBy from './parse/eventsDevBy';
import imaguru from './parse/imaguru';
import vk from './parse/vk';



// import { index } from './routes/index';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const port = process.env.PORT || 3090;

// const uri = 'mongodb://<dbuser>:<dbpassword>@ds061246.mlab.com:61246/cubes';

// mongodb://example_user:example_pass@mlab.com:12345/db
// db = mongoose.connect(uri);

app.listen(port, () => {
  console.log('Server ready on:', port);

  // mongoose.connect('mongodb://localhost/events_app');
  // mongoose.connect('mongodb://user:password@ds061246.mlab.com:61246/cubes?authSource=dbWithUserCredentials');
  // mongoose.connect(uri);
  mongoose.connection
     .once('open', () => {
      //  const { events } = mongoose.connection.collections;
      //  console.log(events);
      //  if (events) {
      //    events.drop(() => {
      //      console.log('droppped')
      //
        //  });
      //  }

      Event.remove({ })
      .then(() => {
            meetupBy.init();
            eventsDevBy.init();
            imaguru.init();
            // vk.init();

      });

       console.log('all ok')
     })
     .on('error', (error) => {
       console.warn('Warning', error);
     });
});

// fs.writeFileSync('./data.json', '[]');


app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/* '}));

// app.use('/users', index);

app.use(express.static(__dirname + '/build'));



app.get('/', function(req, res){
  res.sendFile(__dirname + '/build');
});

app.get('/events', function (req, res) {
  // res.json(JSON.parse(fs.readFileSync('./data.json')));

  const today = req.param('today');
  const search = req.param('search');
  console.log(today);


  var start = new Date();
start.setHours(0,0,0,0);

var end = new Date();
end.setHours(23,59,59,999);
// end.setDate(end.getDate() + 5);

const obj = {};

if (today) {
  obj.date = {$gte: Date.parse(start), $lt: Date.parse(end)};
}
if (true) {
  // obj.title = /^`${search}`/;
  // obj.title = {$regex : "^" + search, 'i'};
  // obj.title = { $regex: new RegExp("^" + search.toLowerCase()) };
  let reg = new RegExp("^" + search.toLowerCase() + "$");
  // console.log(reg, 'req');
  // obj['title_lower'] = /^soft$/i;

  obj['lower-title'] = { $regex: reg, '$options' : 'i' }

  // db.collection.find({name:{'$regex' : '^string$', })
  // username: {$regex : "^" + req.params.username
}

console.log(obj);


  Event.find(obj)
    .sort({ date: 1 })
    .limit(50)
    .then((events) => {
      // console.log(events)
      res.json(events);
    });
})

// console.log(meetupBy);
// meetupBy();



app.get('/event', function (req, res) {
  const id = req.param('id');
  // const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

  Event.find({ _id: id})
    .then(item => {
      const { source, originalLink } = item[0];

      const link = `http://${source}/${originalLink}`;
      axios.get(link)
        .then(data => {

          switch (source) {
            case 'meetup.by':
              meetupBy.parseEvent(data, item).then(data => {
                res.send(data);
              })
              break;
            case 'imaguru.by':
              imaguru.parseEvent(data, item).then(data => {
                res.send(data);
              })
              break;
            case 'events.dev.by':
              eventsDevBy.parseEvent(data, item).then(data => {
                res.send(data);
              })
              break;
            case 'vk.com/minskforfree':
              vk.parseEvent(data, item).then(data => {
                res.send(data);
              })
              break;
            default:
              res.send({})

          }
        })
        .catch(error => {
        })
    });



})

// app.get('/event/', function(req, res) {
//   res.sendFile(__dirname + '/build');
//   // next();
// });
