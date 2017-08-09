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


import cron from 'node-cron';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = process.env.PORT || 3090;

const app = express();
// var server = require('http').Server(app);
const server = app.listen(port, () => {
  console.log('Server ready on:', port);
});
const io = require('socket.io').listen(server);


const url = 'mongodb://HappyLoL:12345678@ds061246.mlab.com:61246/cubes';
// const url = 'mongodb://localhost/events_app';

var chrono = require('chrono-node')
// console.log(chrono.parse('ллдлд 9 – 22 august')[0].end);
// console.log('here');
console.log(chrono.parse('12 — 13 august Витебск')[0]);
const connections = [];




io.sockets.on('connection', function (socket) {

  console.log('------------');

  socket.once('disconnect', function()  {
    console.log('disconnect');
    // console.log('Connected: %s sockets connected.', connections.length);
  });

  connections.push(socket);
  console.log('Connected: %s sockets connected.', connections.length);

});

mongoose.connect(url);
mongoose.connection
   .once('open', () => {

     const run = () => {
       meetupBy.init();
       eventsDevBy.init();
       imaguru.init();
       //
       vk.init();
       freeFitnessMinsk.init();
       //
       sportMts.init();


       setTimeout(() => {
         io.sockets.emit('events-updated');
       }, 1000*15);
     }

     // now
    //  run();

     setTimeout(() => {
       run();
     }, 1000*60*5);
     // 5 min for dev



     cron.schedule('* * 1 * *', () => {
       console.log('running a task every hour');
       run();
     });
   })
   .on('error', (error) => {
     console.warn('Warning', error);
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
  const past = req.param('past');
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
} else if (past) {
  obj.date = {$lt: Date.parse(start) };
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
    sportMts: 'sport.mts.by'
  }

  console.log(sources.split(','));

  obj.source = { $in: sources.split(',').map(item => dict[item]) };
}

console.log(obj);


  Event.find(obj)
    .sort(past ? { date: -1 } : { date: 1 })
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

      res.send(item);


      // const { source, originalLink } = item[0];
      //
      // const link = `http://${source}/${originalLink}`;
      // axios.get(link)
      //   .then(data => {
      //
      //     switch (source) {
      //       case 'meetup.by':
      //         meetupBy.parseEvent(data, item).then(data => {
      //           res.send(data);
      //         })
      //         break;
      //       case 'imaguru.by':
      //         imaguru.parseEvent(data, item).then(data => {
      //           res.send(data);
      //         })
      //         break;
      //       case 'events.dev.by':
      //         eventsDevBy.parseEvent(data, item).then(data => {
      //           res.send(data);
      //         })
      //         break;
      //       case 'vk.com/minskforfree':
      //         vk.parseEvent(data, item).then(data => {
      //           res.send(data);
      //         })
      //         break;
      //       case 'sport.mts.by':
      //         sportMts.parseEvent(data, item).then(data => {
      //           res.send(data);
      //         })
      //         break;
      //       // case 'vk.com/minskforfree':
      //       //   vk.parseEvent(data, item).then(data => {
      //       //     res.send(data);
      //       //   })
      //       //   break;
      //       default:
      //         res.send({})
      //
      //     }
      //   })
      //   .catch(error => {
      //   })
    });
});

// app.get('*', function(req, res){
//     console.log('sended');
//
//   res.sendFile(__dirname + '/build');
// });

app.use(function(req, res, next) {
    // res.sendFile(__dirname + '/build');
    res.sendFile((__dirname + '/build/index.html'));
    // express.static.send(req, res, next ,{
    //     root: __dirname + "/public",
    //     path: req.url,
    //     getOnly: true
    // });
});

// app.use('*', function(req, res) {
//   console.log('sended');
//   res.sendFile(__dirname + '/build');
// });
