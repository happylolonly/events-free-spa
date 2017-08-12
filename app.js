import express from 'express';
import mongoose from 'mongoose';

import Event from './model/event';

import meetupBy from './parse/meetupBy';
import eventsDevBy from './parse/eventsDevBy';
import imaguru from './parse/imaguru';
import vk from './parse/vk';
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
    connections.splice(connections.indexOf(socket), 1);
    socket.disconnect();
    console.log('Connected: %s sockets connected.', connections.length);
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
       sportMts.init();

       vk.init('minskforfree');
       vk.init('free_fitness_minsk');

       setTimeout(() => {
         io.sockets.emit('events-updated');
       }, 1000*15);
     }

     // now
     run();

    //  setTimeout(() => {
    //    run();
    //  }, 1000*60*5);
     // 5 min for dev


     cron.schedule('* * 1 * * *', () => {
       console.log('running a task every hour');
       run();
     });
   })
   .on('error', (error) => {
     console.warn('Warning', error);
   });


app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/* '}));

app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res){
  // res.send('kdfldkfl');
  res.sendFile(__dirname + '/build/index.html');
});

app.get('/events', function (req, res) {

  const { today, past, search, sources, offset } = req.query;

  if (!sources) {
    res.send = [];
  }
  // console.log(today);


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
  // console.log('here', sources);

  const dict = {
    meetupBy: 'meetup.by',
    imaguru: 'imaguru.by',
    eventsDevBy: 'events.dev.by',
    minskforfree: 'vk.com/minskforfree',
    freeFitnessMinsk: 'vk.com/free_fitness_minsk',
    sportMts: 'sport.mts.by'
  }

  // console.log(sources.split(','));

  obj.source = { $in: sources.split(',').map(item => dict[item]) };
}

// console.log(obj);


  Event.find(obj)
    .sort(past ? { date: -1 } : { date: 1 })
    .limit(+offset)
    .then((events) => {
      // console.log(events)

      //  if (this.state.events.length === 0) return this.state.events;
      // пока костыль
       let items = events.filter(item => {
         let item2 = item.title.toLowerCase();
         return item2.indexOf(search.toLowerCase()) !=-1;
       })


      res.json(items);
    });
})

app.get('/event', (req, res) => {
  const { id } = req.query;

  Event.find({ _id: id })
    .then(item => res.send(item));
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
