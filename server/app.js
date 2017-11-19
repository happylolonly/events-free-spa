import 'newrelic';

var rootCas = require('ssl-root-cas/latest').create();

// default for all https requests
// (whether using https directly, request, or another module)
require('https').globalAgent.options.ca = rootCas;



import express from 'express';
import mongoose from 'mongoose';

import meetupBy from './parse/meetupBy';
import eventsDevBy from './parse/eventsDevBy';
import imaguru from './parse/imaguru';
import vk from './parse/vk';
import sportMts from './parse/sportMts';

import space from './parse/space';
import htp from './parse/htp';
import daonlp from './parse/daonlp';

import citydogVedy from './parse/citydogVedy';
import citydogAfisha from './parse/citydogAfisha';


import axios from 'axios';

import cron from 'node-cron';

// import renderer from './helpers/renderer';
// import createStore from './helpers/createStore';

// import ph from './phantom/index';

const bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');

const port = process.env.PORT || 3090;

// ph();





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
  axios.get('https://eventsfree.herokuapp.com')
    .then(data => {
      console.log('all ok');
    })
    .catch(error => {
      console.log('some error');
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

// не лазьте тут плз)
const url = 'mongodb://HappyLoL:12345678@ds061246.mlab.com:61246/cubes';
// const url = 'mongodb://localhost/events_app';

const connections = [];

const run = () => {
  meetupBy.init();
  eventsDevBy.init();
  imaguru.init();
  sportMts.init();
  //
  // // htp.init();
  // // space.init();
  // // daonlp.init();
  //
  citydogAfisha.init();

  setTimeout(() => { // citydog blocks
    citydogVedy.init();
  }, 1000);

  vk.init('minskforfree');
  vk.init('free_fitness_minsk');
  vk.init('free_languages_minsk');

  setTimeout(() => {
    io.sockets.emit('events-updated');
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

// var jsonParser = bodyParser.json()
//
// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/../build'));

// routes
require('./routes/index')(app);
require('./routes/events')(app);
require('./routes/feedback')(app);
require('./routes/moderate')(app);

// app.get('*', function(req, res){
//     console.log('sended');
//
//   res.sendFile(__dirname + '/build');
// });

app.use(function(req, res, next) {

    // const store = createStore(req);
    // res.sendFile(__dirname + '/build');
    res.sendFile(path.join(__dirname, '../build/index.html'));

    // const content = renderer(req, store);
    // res.send(content);

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
