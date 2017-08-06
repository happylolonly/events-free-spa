import express from 'express';
import mongoose from 'mongoose';


import axios from 'axios';

import Event from './model/event';

import meetupBy from './parse/meetupBy';
import eventsDevBy from './parse/eventsDevBy';
import imaguru from './parse/imaguru';
import vk from './parse/vk';
import freeFitnessMinsk from './parse/freeFitnessMinsk';
import sportMts from './parse/sportMts';



const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const port = process.env.PORT || 3090;

const url = 'mongodb://HappyLoL:12345678@ds061246.mlab.com:61246/cubes';
// const url = 'mongodb://localhost/events_app';

var chrono = require('chrono-node')
console.log(chrono.parseDate('17 августа'));

mongoose.connect(url);
mongoose.connection
   .once('open', () => {
     meetupBy.init();
     // eventsDevBy.init();
     // imaguru.init();
     // vk.init();
     // freeFitnessMinsk.init();
     // sportMts.init();

    //  const { events } = mongoose.connection.collections;
    // //  console.log(events);
    //  if (events) {
    //    events.drop(() => {
    //       console.log('droppped');
    //
    //
    //
    //
    //
    //    });
    //  }

    // Event.remove({ })
    // .then(() => {
    //
    // });

    //  console.log('all ok')
   })
   .on('error', (error) => {
     console.warn('Warning', error);
   });

app.listen(port, () => {
  console.log('Server ready on:', port);



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
  const sources = req.param('sources');
  const offset = req.param('offset');

  if (!sources) {
    res.send = [];
  }
  console.log(today);


  var start = new Date();
start.setHours(0,0,0,0);

var end = new Date();
end.setHours(23,59,59,999);
// end.setDate(end.getDate() + 5);

const obj = {};

if (today) {
  obj.date = {$gte: Date.parse(start), $lt: Date.parse(end)};
} else {
  obj.date = {$gte: Date.parse(start) };
}

if (false) {
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

if (sources) {
  console.log('here', sources);

  const dict = {
    meetupBy: 'meetup.by',
    imaguru: 'imaguru.by',
    eventsDevBy: 'events.dev.by',
    minskforfree: 'vk.com/minskforfree',
    sportMts: 'sport.mts.by/master-klassy/minsk/'
  }

  console.log(sources.split(','));

  obj.source = { $in: sources.split(',').map(item => dict[item]) };
}

console.log(obj);


  Event.find(obj)
    .sort({ date: 1 })
    .limit(+offset)
    .then((events) => {
      console.log(events)

      //  if (this.state.events.length === 0) return this.state.events;
      // пока костыль
       let items = events.filter(item => {
         let item2 = item.title.toLowerCase();
         return item2.indexOf(search.toLowerCase()) !=-1;
       })


      res.json(items);
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
