import './modules/newrelic';

import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';

import config from './configs';

import parse from './helpers/parse';

// import renderer from './helpers/renderer';
// import createStore from './helpers/createStore';
// // import Routes from '../client/src/routes';
// import { matchRoutes } from 'react-router-config';

var path = require('path');

const app = express();

const port = process.env.PORT || config.port;

const server = app.listen(port, () => {
  console.log('Server ready on:', port);
});
const io = require('socket.io').listen(server);

require('./helpers/db').default(mongoose, () => {

  parse(io);

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

app.use((req, res, next) => {

    // const store = createStore(req);
    // res.sendFile(__dirname + '/build');
    res.sendFile(path.join(__dirname, '/../build/index.html'));

    // const content = renderer(req, store);
    // res.send(content);

  // const store = createStore(req);

  // const promises = matchRoutes(Routes, req.path)
  //   .map(({ route }) => {
  //     return route.loadData ? route.loadData(store) : null;
  //   });
    // .map(promise => {
    //   if (promise) {
    //     return new Promise((resolve, reject) => {
    //       promise.then(resolve).catch(resolve);
    //     });
    //   }
    // });

  // Promise.all(promises).then(() => {
  //   const context = {};
  //   const content = renderer(req, store, context);

    // if (context.url) {
    //   return res.redirect(301, context.url);
    // }
    // if (context.notFound) {
    //   res.status(404);
    // }

//     res.send(content);
//   });
});

// app.use('*', function(req, res) {
//   console.log('sended');
//   res.sendFile(__dirname + '/build');
// });
