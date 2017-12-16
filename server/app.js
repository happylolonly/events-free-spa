import './modules/newrelic';

import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';

import config from './configs';

import parse from './helpers/parse';

// import renderer from './helpers/renderer';
// import createStore from './helpers/createStore';

var path = require('path');

const app = express();

const port = process.env.PORT || config.port;

const server = app.listen(port, () => {
  console.log('Server ready on:', port);
});
const io = require('socket.io').listen(server);

require('./helpers/db').default(mongoose, () => {

  parse();

  cron.schedule('* * 1 * * *', () => {
    console.log('running a task every hour');
    parse(io);
  });

});
require('./helpers/sockets').default(io);
require('./middlewares').default(app, express);
require('./routes').default(app);



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
});

// app.use('*', function(req, res) {
//   console.log('sended');
//   res.sendFile(__dirname + '/build');
// });
