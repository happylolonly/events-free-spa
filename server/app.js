import express from 'express';
import mongoose from 'mongoose';

import Event from './model/event';
import Feedback from './model/feedback';

import meetupBy from './parse/meetupBy';
import eventsDevBy from './parse/eventsDevBy';
import imaguru from './parse/imaguru';
import vk from './parse/vk';
import sportMts from './parse/sportMts';

import axios from 'axios';

import moment from 'moment';

import cron from 'node-cron';

import fs from 'fs';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const port = process.env.PORT || 3090;

const app = express();
// var server = require('http').Server(app);
const server = app.listen(port, () => {
  console.log('Server ready on:', port);
});
const io = require('socket.io').listen(server);

var compression = require('compression')
// var express = require('express')

// var app = express()

// compress all responses

// var http = require("http");

const wakeUpHeroku = () => {
  axios.get('http://eventsfree.by')
    .then(data => {
      console.log('all ok', data);
    })
    .catch(error => {
      console.log('some error', error);
    })
}

setTimeout(() => {
  console.log('check wake up');
  wakeUpHeroku();

}, 60*1000);

cron.schedule('* 10 * * * *', () => {
  console.log('schedule wake up');
  wakeUpHeroku();
});


const url = 'mongodb://HappyLoL:12345678@ds061246.mlab.com:61246/cubes';
// const url = 'mongodb://localhost/events_app';

// var chrono = require('chrono-node')
// console.log(chrono.parse('ллдлд 9 – 22 august')[0].end);
// console.log('here');
// console.log(chrono.parse('12 — 13 august Витебск')[0]);
const connections = [];

const run = () => {
  meetupBy.init();
  eventsDevBy.init();
  imaguru.init();
  sportMts.init();

  vk.init('minskforfree');
  vk.init('free_fitness_minsk');

  setTimeout(() => {
    io.sockets.emit('events-updated');
    console.log(__dirname);
  }, 1000*15);
}


io.sockets.on('connection', function (socket) {

  console.log('------------');

  // socket.use((packet, next) => {
  //   // if (packet.doge === true)
  //   return next();
  //   // next(new Error('Not a doge error'));
  // });

  socket.once('disconnect', function()  {
    console.log('disconnect');
    connections.splice(connections.indexOf(socket), 1);
    socket.disconnect();
    console.log('Connected: %s sockets connected.', connections.length);
  });


  socket.on('reparse events', function()  {
    console.log('reparsing starts');
    run();
  });

  connections.push(socket);
  console.log('Connected: %s sockets connected.', connections.length);

});



mongoose.connect(url);
mongoose.connection
   .once('open', () => {

    //  Event.find({})
    //   .then(items => {
    //     fs.writeFileSync('./data2.json', JSON.stringify(items));
    //   })


    // Event.updateMany({}, {$set: { status: 'active' }} ).then(i => console.log(i));

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
app.use(compression())

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
//
// app.use(bodyParser.json({ type: '*/* '}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/feedback', function(req, res) {
  console.log(req.body);
  const { date, message } = req.body;
  // res.send(req);

  const feedback = new Feedback({ date, message });

  feedback.save()
    .then((data) => {
      console.log('feedback saved');
      res.send('saved');
    })
    .catch(error => {
      console.log(error);
      res.status(422).send(error);
    })
});

// var jsonParser = bodyParser.json()
//
// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + './build'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './build');
});

app.get('/feedback', (req, res) => {
  Feedback.find({})
    .then((data) => {
      res.send(data);
    })
    .catch(error => {
      res.status(422).send(error);
    })
})

app.delete('/feedback', (req, res) => {
  console.log(req.body);
  const { id } = req.query;
  console.log(id);

  // res.send(id);

  Feedback.findByIdAndRemove(id)
    .then(data => {
      console.log(data);
      res.send('success');
    })
    .catch(error => {
      console.log(error);
      res.status(422).send(error);
    })
});

app.get('/moderate', (req, res) => {
  Event.find({ status: 'noactive' })
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(422).send(error);
    })
});

app.put('/moderate', (req, res) => {
  const { id, moderate } = req.query;
  console.log(id, moderate);

  Event.findByIdAndUpdate(id, { status: moderate === 'true' ? 'active' : 'rejected' })
    .then(() => {
      res.send(true);
    })
    .catch(error => {
      res.status(422).send(error);
    })
})

app.get('/events', function (req, res) {

  const { today, past, search, sources, offset } = req.query;

  if (!sources) {
    res.send = [];
  }
  // console.log(today);


  var start = moment.utc().format();


  // console.log(start.getTimezoneOffset());
// start.setHours(0,0,0,0);
start = moment(start).set({hour:0,minute:0,second:0,millisecond:0});

var end = moment.utc().format();
end = moment(end).set({hour:23,minute:59,second:59,millisecond:999});
// end.setHours(23,59,59,999);
// end.setDate(end.getDate() + 5);

const obj = {};

// console.log((start));
// console.log((start.toUTCString()));

// date master

if (today) {
  obj.date = {$gte: Date.parse(start) - 1000*60*60*3 , $lt: Date.parse(end) - 1000*60*60*3};
} else if (past) {
  obj.date = {$lt: Date.parse(start) - 1000*60*60*3  };
} else {
  obj.date = {$gte: Date.parse(start) - 1000*60*60*3  };
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

obj.status = 'active';

console.log(obj);


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
    res.sendFile((__dirname + './build/index.html'));
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
